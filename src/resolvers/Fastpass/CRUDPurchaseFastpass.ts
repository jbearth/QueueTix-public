import "reflect-metadata";
import { Arg, Ctx, Mutation, Query } from "type-graphql";

// thirds-party

// project imports
import { MessageResponse, PurchaseFastpassResponse } from "@utils/myresponse";
import { MyContext } from "@resolvers/types/MyContext";
import { PurchaseTicketFastpass } from "@prisma/generated/type-graphql";
import { PurchaseFastpassInput, PurchaseFastpassType } from "./FastpassInput";

export class CRUDPurchaseFastpassResolver {

  @Query(() => PurchaseFastpassResponse)
  async GetFastpass(
    @Arg("id_fastpass") id_fastpass: string,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)

      const foundFastpass = await context.prisma.purchaseTicketFastpass.findUnique({
        where: {
          id: id_fastpass
        },
        include: {
          purchasefastpassofrides: true
        }
      });

      if (!foundFastpass) {
        throw new Error("Error not found fastpass id: " + foundFastpass.id);
      }

      return {
        success: {
          message: "Retrive Fastpass Data"
        },
        data: foundFastpass
      };

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

  @Query(() => [PurchaseTicketFastpass])
  async GetFastpassAll(
    @Arg("email") email: string,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const user = await context.prisma.user.findFirst({
        where: {
          email
        }
      });

      console.log("user: ", user);

      if (!user) {
        throw new Error("The specified user email could not be found.");
      }

      const foundFastpass = await context.prisma.purchaseTicketFastpass.findMany({
        where: {
          userId: user.id,
        },
        include: {
          purchasefastpassofrides: {
            include: {
              PurchaseTicketTypes: {
                include: {
                  purchaseticket: true
                }
              },
              rides: {
                include: {
                  amusementpark: true
                }
              }
            }
          }
        }
      });

      if (!foundFastpass) {
        throw new Error("Error not found all records fastpass data");
      }

      return foundFastpass;

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

  @Query(() => [PurchaseTicketFastpass])
  async GetFastpassAll2(
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)

      const foundFastpass = await context.prisma.purchaseTicketFastpass.findMany({
        include: {
          purchasefastpassofrides: {
            include: {
              PurchaseTicketTypes: {
                include: {
                  purchaseticket: true
                }
              },
              rides: {
                include: {
                  amusementpark: true
                }
              }
            }
          }
        }
      });

      if (!foundFastpass) {
        throw new Error("Error not found all records fastpass data");
      }

      return foundFastpass;

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }


  // ====================================================================================================
  @Mutation(() => MessageResponse)
  async CreateFastpass(
    @Arg("CreateFastpassInput") purchasefastpassinput: PurchaseFastpassInput,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)

      // รับ array PurchaseFastpassType จาก input
      const purchaseFastpassTypeArray: PurchaseFastpassType[] = purchasefastpassinput.pruchasefastpass;

      // เพิ่ม object เข้าไปใน array ของ newPurchaseFastpass
      const newPurchaseFastpass = purchaseFastpassTypeArray.map((purchaseFastpass) => {
        return {
          id_amusementpark: purchaseFastpass.id_amusementpark,
          id_rides: purchaseFastpass.id_rides,
          id_roundrides: purchaseFastpass.id_roundrides,
          id_purchasetickettypes: purchaseFastpass.id_purchasetickettypes,
          startDateTime: purchaseFastpass.startDateTime,
          endDateTime: purchaseFastpass.endDateTime
        };
      });

      const user = await context.prisma.user.findUnique({
        where: {
          email: purchasefastpassinput.email,
        },
      });

      if (!user) {
        throw new Error("Error not found data user");
      }

      // ======= Generate OrderId =======
      // รับวันที่ปัจจุบันในรูปแบบ 'yyMMdd'
      const currentDate = new Date().toLocaleDateString("th-TH", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      });
      const currentDateFormat = currentDate.split("/").reverse().join("");

      // สร้างตัวอักษรพิมพ์ใหญ่(A-Z)แบบสุ่ม 8 ตัว
      const randomLetters = Array.from({ length: 8 }, () =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      ).join("");

      const orderId = `${currentDateFormat}N${randomLetters}`;

      // console.log("userId: ", user.id);
      // console.log("orderId: ", orderId);
      // console.log(newPurchaseFastpass);
      // console.log("length: ", newPurchaseFastpass.length);
      const foundRRTicketAndFastPassId = await context.prisma.roundRidesOfTicketandFastpass.findFirst({
        where: {
          roundRidesId: newPurchaseFastpass[0].id_roundrides,
          types: "Fastpass",
        }
      });

      console.log("foundRRTicketAndFastPassId.usedCount: ", foundRRTicketAndFastPassId.usedCount);
      console.log("newUsedCount: ", foundRRTicketAndFastPassId.usedCount + purchasefastpassinput.countofused);

      await context.prisma.roundRidesOfTicketandFastpass.updateMany({
        where: {
          id: foundRRTicketAndFastPassId.id,
          roundRidesId: newPurchaseFastpass[0].id_roundrides,
          types: "Fastpass"
        },
        data: {
          usedCount: foundRRTicketAndFastPassId.usedCount + purchasefastpassinput.countofused
        }
      });

      // console.log("updateRoundRidesFastpass: ", updateRoundRidesFastpass);

      newPurchaseFastpass.map(async (item, index) => {
        await context.prisma.purchaseTicketFastpass.create({
          data: {
            orderId: orderId,
            userId: user.id,
            amusementParkId: item.id_amusementpark,
            startDateTime: new Date(item.startDateTime),
            endDateTime: new Date(item.endDateTime),
            isUsed: 0,
            purchasefastpassofrides: {
              create: {
                ridesId: item.id_rides,
                purchasetickettypesId: item.id_purchasetickettypes
              }
            }
          }
        });
        // console.log("bookingFastpass: ", bookingFastpass);
      });

      return {
        success: {
          message: "Successfully created booking fastpass"
        },
      };

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }


  // ====================================================================================================
  @Mutation(() => PurchaseFastpassResponse)
  async UpdateFastpass(
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundFastpass = await context.prisma.purchaseTicketFastpass.findMany({});

      if (!foundFastpass) {
        throw new Error("Error not found data fastpass");
      }

      return {
        success: {
          message: "Retrive Fastpass Data"
        },
        data: foundFastpass
      };

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }


  // ====================================================================================================
  @Mutation(() => MessageResponse)
  async DeleteFastpass(
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundFastpass = await context.prisma.purchaseTicketFastpass.findMany({});

      if (!foundFastpass) {
        throw new Error("Error not found data fastpass");
      }

      return {
        success: {
          message: "Retrive Fastpass Data"
        },
        data: foundFastpass
      };

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

}  