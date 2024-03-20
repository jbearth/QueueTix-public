import "reflect-metadata";
import { Arg, Ctx, Query, Mutation } from "type-graphql";

// thirds-party

// project imports
import { MessageResponse, PurchaseTicketResponse } from "@utils/myresponse";
import { MyContext } from "@resolvers/types/MyContext";
import { PurchaseTicketInput, PurchaseTicketType, UpdatePurchaseTicketInput } from "./ProductInput";
import { PurchaseTicket, PurchaseTicketStatus } from "@prisma/generated/type-graphql";

export class PurchaseTicketResolver {

  @Query(() => [PurchaseTicket])
  async getPurchaseTicket(
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

      const purchaseticket = await context.prisma.purchaseTicket.findMany({
        where: {
          userId: user.id,
        },
        include: {
          ticket: true,
          user: true,
          amusementpark: true,
          purchasetickettypes: {
            include: {
              purchaseticketofrides: true,
              ticketforentrance: true
            }
          },
        }
      });

      return purchaseticket;


    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

  @Query(() => [PurchaseTicket])
  async getPurchaseTicketAll(
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)

      const purchaseticket = await context.prisma.purchaseTicket.findMany({
        include: {
          purchasetickettypes: true,
        }
      });

      return purchaseticket;


    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

  @Mutation(() => PurchaseTicketResponse)
  async CreatePurchaseTicket(
    @Arg("CreatePurchaseTicketInput") purchaseticketinput: PurchaseTicketInput,
    @Ctx() context: MyContext
  ) {

    try {
      // isAuthorized(context.request)

      // รับ array PurchaseTicketType จาก input
      const purchaseTicketTypeArray: PurchaseTicketType[] = purchaseticketinput.purchaseticket;

      // เพิ่ม object เข้าไปใน array ของ newPurchaseticket
      const newPurchaseticket = purchaseTicketTypeArray.map((purchaseTicket) => {
        return {
          id_ticket: purchaseTicket.id_ticket,
          id_amusementpark: purchaseTicket.id_amusementpark,
          titleticket: purchaseTicket.titleticket,
          types_of_ticket: purchaseTicket.types_of_ticket,
          priceofchild: purchaseTicket.priceofchild,
          amountofchild: purchaseTicket.amountofchild,
          priceofadult: purchaseTicket.priceofadult,
          amountofadult: purchaseTicket.amountofadult,
          totalprice: purchaseTicket.totalprice,
          maxround: purchaseTicket.maxround,
          dateofuse: purchaseTicket.dateofuse,
          haspromotion: purchaseTicket.haspromotion
        };
      });

      const user = await context.prisma.user.findUnique({
        where: {
          email: purchaseticketinput.email,
        },
      });

      if (!user) {
        throw new Error("Error not found data user");
      }

      const rides = await context.prisma.rides.findMany({
        where: {
          amusementparkId: newPurchaseticket[0].id_amusementpark
        }
      });

      if (!rides) {
        throw new Error("Error not found data rides");
      }

      // console.log(user);
      console.log("rides: ", rides);
      // console.log("purchaseticketinput: ", newPurchaseticket);

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
      // console.log(orderId);

      newPurchaseticket.map(async (item, index) => {
        const purchaseticket = await context.prisma.purchaseTicket.create({
          data: {
            orderId: orderId,
            userId: user.id,
            ticketId: item.id_ticket,
            amusementParkId: item.id_amusementpark,
            types: item.types_of_ticket,
            dateofuse: item.dateofuse,
            hasPromotion: item.haspromotion,
          }
        });

        Array.from({ length: item.amountofchild }, (_, index) => index).map(
          async () => {
            const purchasetickettypeschild = await context.prisma.purchaseTicketTypes.create({
              data: {
                purchaseTicketId: purchaseticket.id,
                types: "Child",
                amount: 1,
                price: item.priceofchild / item.amountofchild
              }
            });
            for (let i = 0; i < rides.length; i++) {
              const checkMaxRoundsRidesOfTicket = item.types_of_ticket === "DreamWorldVisa" && rides[i].isSpecial === 1 ? 1 : item.maxround;
              await context.prisma.purchaseTicketOfRides.create({
                data: {
                  ridesId: rides[i].id,
                  purchasetickettypesId: purchasetickettypeschild.id,
                  usedLimit: checkMaxRoundsRidesOfTicket,
                  usedCount: 0
                }
              });
            }
          }
        );

        Array.from({ length: item.amountofadult }, (_, index) => index).map(
          async () => {
            const purchasetickettypesadult = await context.prisma.purchaseTicketTypes.create({
              data: {
                purchaseTicketId: purchaseticket.id,
                types: "Adult",
                amount: 1,
                price: item.priceofadult / item.amountofadult
              }
            });
            for (let i = 0; i < rides.length; i++) {
              const checkMaxRoundsRidesOfTicket = item.types_of_ticket === "DreamWorldVisa" && rides[i].isSpecial === 1 ? 1 : item.maxround;
              console.log(checkMaxRoundsRidesOfTicket);
              await context.prisma.purchaseTicketOfRides.create({
                data: {
                  ridesId: rides[i].id,
                  purchasetickettypesId: purchasetickettypesadult.id,
                  usedLimit: checkMaxRoundsRidesOfTicket,
                  usedCount: 0
                }
              });
            }
          }
        );
      });

      return {
        success: {
          message: "Successfully created purchase ticket"
        },
        data: orderId
      };

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

  // Update
  @Mutation(() => MessageResponse)
  async UpdatePurchaseTicket(
    @Arg("UpdatePurchaseTicketInput") purchaseticketinput: UpdatePurchaseTicketInput,
    @Ctx() context: MyContext
  ) {

    try {
      // isAuthorized(context.request)

      const {
        id_ticket,
        id_amusementpark,
        titleticket,
        types_of_ticket,
        priceofchild,
        amountofchild,
        priceofadult,
        amountofadult,
        totalprice,
        maxround,
        dateofuse,
        haspromotion
      } = purchaseticketinput.purchaseticket;

      const user = await context.prisma.user.findUnique({
        where: {
          email: purchaseticketinput.email,
        },
      });

      if (!user) {
        throw new Error("Error not found data user");
      }

      // const rides = await context.prisma.rides.findMany({
      //   where: {
      //     amusementparkId: newPurchaseticket[0].id_amusementpark
      //   }
      // });

      // if (!rides) {
      //   throw new Error("Error not found data rides");
      // }

      // // console.log(user);
      // console.log("rides: ", rides);
      // // console.log("purchaseticketinput: ", newPurchaseticket);

      // // ======= Generate OrderId =======
      // // รับวันที่ปัจจุบันในรูปแบบ 'yyMMdd'
      // const currentDate = new Date().toLocaleDateString("th-TH", {
      //   year: "2-digit",
      //   month: "2-digit",
      //   day: "2-digit",
      // });
      // const currentDateFormat = currentDate.split("/").reverse().join("");


      // // สร้างตัวอักษรพิมพ์ใหญ่(A-Z)แบบสุ่ม 8 ตัว
      // const randomLetters = Array.from({ length: 8 }, () =>
      //   String.fromCharCode(65 + Math.floor(Math.random() * 26))
      // ).join("");

      // const orderId = `${currentDateFormat}N${randomLetters}`;
      // // console.log(orderId);


      // newPurchaseticket.map(async (item, index) => {
      //   const purchaseticket = await context.prisma.purchaseTicket.create({
      //     data: {
      //       orderId: orderId,
      //       userId: user.id,
      //       ticketId: item.id_ticket,
      //       amusementParkId: item.id_amusementpark,
      //       types: item.types_of_ticket,
      //       dateofuse: item.dateofuse,
      //       hasPromotion: item.haspromotion,
      //     }
      //   });

      //   Array.from({ length: item.amountofchild }, (_, index) => index).map(
      //     async () => {
      //       const purchasetickettypeschild = await context.prisma.purchaseTicketTypes.create({
      //         data: {
      //           purchaseTicketId: purchaseticket.id,
      //           types: "Child",
      //           amount: 1,
      //           price: item.priceofchild / item.amountofchild
      //         }
      //       });
      //       for (let i = 0; i < rides.length; i++) {
      //         await context.prisma.purchaseTicketOfRides.create({
      //           data: {
      //             ridesId: rides[index].id,
      //             purchasetickettypesId: purchasetickettypeschild.id,
      //             usedLimit: item.maxround,
      //             usedCount: 0
      //           }
      //         });
      //       }
      //     });

      //   Array.from({ length: item.amountofadult }, (_, index) => index).map(
      //     async () => {
      //       const purchasetickettypesadult = await context.prisma.purchaseTicketTypes.create({
      //         data: {
      //           purchaseTicketId: purchaseticket.id,
      //           types: "Adult",
      //           amount: 1,
      //           price: item.priceofadult / item.amountofadult
      //         }
      //       });
      //       for (let i = 0; i < rides.length; i++) {
      //         await context.prisma.purchaseTicketOfRides.create({
      //           data: {
      //             ridesId: rides[index].id,
      //             purchasetickettypesId: purchasetickettypesadult.id,
      //             usedLimit: item.maxround,
      //             usedCount: 0
      //           }
      //         });
      //       }
      //     });
      // });

      return {
        success: {
          message: "Successfully created purchase ticket"
        }
      };

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

  @Mutation(() => MessageResponse)
  async UpdatePurchaseTicketStatus(
    @Arg("email") email: string,
    @Arg("order_purchaseticket") order_purchaseticket: string,
    @Arg("status_ticket") status_ticket: PurchaseTicketStatus,
    @Ctx() context: MyContext
  ) {

    try {
      // isAuthorized(context.request)

      const user = await context.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new Error("Error not found data user");
      }

      await context.prisma.purchaseTicket.updateMany({
        where: {
          orderId: order_purchaseticket
        },
        data: {
          status: status_ticket
        }
      });

      return {
        success: {
          message: "Successfully updated status purchase ticket"
        }
      };

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    } finally {
      await context.prisma.$disconnect();
    }
  }

}