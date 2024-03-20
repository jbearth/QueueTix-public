import "reflect-metadata";
import { Arg, Ctx, Mutation, Query } from "type-graphql";

// thirds-party

// project imports
import { MessageResponse, RidesResponse } from "@utils/myresponse";
import { MyContext } from "@resolvers/types/MyContext";
import { Rides } from "@prisma/generated/type-graphql";
import { RidesInputCreate, RidesInputUpdate } from "./RidesInput";
import UploadFile from "@features/uploadFile";

export class CRUDRidesResolver {

  @Mutation(() => RidesResponse)
  async GetRidesMutation(
    @Arg("id_rides") id_rides: string,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundRides = await context.prisma.rides.findUnique({
        where: {
          id: id_rides
        }
      });

      if (!foundRides) {
        throw new Error("Error not found rides id: " + foundRides.id);
      }

      return {
        success: {
          message: "Retrive Rides Data"
        },
        data: foundRides
      };

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

  @Query(() => RidesResponse)
  async GetRides(
    @Arg("id_rides") id_rides: string,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundRides = await context.prisma.rides.findUnique({
        where: {
          id: id_rides
        }
      });

      if (!foundRides) {
        throw new Error("Error not found rides id: " + foundRides.id);
      }

      return {
        success: {
          message: "Retrive Rides Data"
        },
        data: foundRides
      };

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

  @Query(() => [Rides])
  async GetRidesAll(
    @Arg("id_amusementpark") id_amusementpark: string,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundRides = await context.prisma.rides.findMany({
        where: {
          amusementparkId: id_amusementpark
        },
        include: {
          roundrides: {
            include: {
              roundridesofticketandfastpass: true
            }
          }
        }
      });

      if (!foundRides) {
        throw new Error("Error not found all records rides data");
      }

      return foundRides;

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
  async CreateRides(
    @Arg("RidesInputCreate") ridesinput: RidesInputCreate,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)

      // Get profile path
      const profilePicturePath = await UploadFile({ image: ridesinput.profilePicture, context });

      const rides = await context.prisma.rides.create({
        data: {
          amusementparkId: ridesinput.id_amusementpark,
          nameEng: ridesinput.nameEng,
          nameThai: ridesinput.nameThai,
          picture: profilePicturePath,
          maxseats: ridesinput.maxseats,
          isSpecial: ridesinput.isSpecial,
          usedFastpassAvailable: ridesinput.usedFastpassAvailable
        }
      });

      return {
        success: {
          message: `Rides ${rides.nameEng} has created successfully`,
        },
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


  // ====================================================================================================
  @Mutation(() => MessageResponse)
  async UpdateRides(
    @Arg("RidesInputUpdate") ridesinputupdate: RidesInputUpdate,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundRides = await context.prisma.rides.findUnique({
        where: {
          id: ridesinputupdate.id_rides
        }
      });

      if (!foundRides) {
        throw new Error("Error not found data rides");
      }

      if (ridesinputupdate.profilePicture.data === "") {
        await context.prisma.rides.update({
          where: {
            id: ridesinputupdate.id_rides
          },
          data: {
            amusementparkId: ridesinputupdate.id_amusementpark,
            nameEng: ridesinputupdate.nameEng,
            nameThai: ridesinputupdate.nameThai,
            maxseats: ridesinputupdate.maxseats,
            isSpecial: ridesinputupdate.isSpecial,
            usedFastpassAvailable: ridesinputupdate.usedFastpassAvailable
          }
        });
      } else {
        // Get profile path
        const profilePicturePath = await UploadFile({ image: ridesinputupdate.profilePicture, context });

        await context.prisma.rides.update({
          where: {
            id: ridesinputupdate.id_rides
          },
          data: {
            amusementparkId: ridesinputupdate.id_amusementpark,
            nameEng: ridesinputupdate.nameEng,
            nameThai: ridesinputupdate.nameThai,
            picture: profilePicturePath,
            maxseats: ridesinputupdate.maxseats,
            isSpecial: ridesinputupdate.isSpecial,
            usedFastpassAvailable: ridesinputupdate.usedFastpassAvailable
          }
        });
      }

      return {
        success: {
          message: `Data of rides ${ridesinputupdate.nameEng} has been successfully updated`,
        },
        data: foundRides
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


  // ====================================================================================================
  @Mutation(() => MessageResponse)
  async DeleteRides(
    @Arg("id_rides") id: string,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const res = await context.prisma.rides.delete({
        where: {
          id
        }
      });

      return {
        success: {
          message: "Deleted rides id: " + id,
        },
        res,
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