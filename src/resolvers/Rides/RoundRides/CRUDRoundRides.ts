import "reflect-metadata";
import { Arg, Ctx, Mutation, Query } from "type-graphql";

// thirds-party

// project imports
import { MessageResponse, RoundRidesResponse } from "@utils/myresponse";
import { MyContext } from "@resolvers/types/MyContext";
import { Rides, RoundRides } from "@prisma/generated/type-graphql";
import { RoundRidesInput, RoundRidesInputUpdate } from "../RoundRidesInput";

export class CRUDRoundRidesResolver {

  @Mutation(() => [RoundRides])
  async GetRoundRidesMutation(
    @Arg("id_roundrides") id_roundrides: string,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundRoundRides = await context.prisma.roundRides.findUnique({
        where: {
          id: id_roundrides
        }
      });

      if (!foundRoundRides) {
        throw new Error("Error not found round rides id: " + foundRoundRides.id);
      }

      return {
        foundRoundRides
      };

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

  @Query(() => RoundRidesResponse)
  async GetRoundRides(
    @Arg("id_roundrides") id_roundrides: string,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundRoundRides = await context.prisma.roundRides.findUnique({
        where: {
          id: id_roundrides
        }
      });

      if (!foundRoundRides) {
        throw new Error("Error not found round rides id: " + foundRoundRides.id);
      }

      return {
        success: {
          message: "Retrive Round Rides Data"
        },
        data: foundRoundRides
      };

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

  @Query(() => [RoundRides])
  async GetRoundRidesAll(
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundRoundRides = await context.prisma.roundRides.findMany({});

      return foundRoundRides;

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
  async CreateRoundRides(
    @Arg("RoundRidesInputCreate") roundridesinput: RoundRidesInput,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)

      const { roundridesinputcreate } = roundridesinput;

      const TypesOfRoundRides: any = ["Normal", "Fastpass"];

      const foundRides = await context.prisma.rides.findMany({});

      for (let j = 0; j < roundridesinputcreate.length; j++) {

        const roundRides = await context.prisma.roundRides.create({
          data: {
            ridesId: roundridesinputcreate[0].id_rides,
            startTime: roundridesinputcreate[j].startTime,
            endTime: roundridesinputcreate[j].endTime
          }
        });

        Array.from({ length: 2 }, (_, index) => index).map(
          async (_, index) => {
            await context.prisma.roundRidesOfTicketandFastpass.create({
              data: {
                roundRidesId: roundRides.id,
                types: TypesOfRoundRides[index],
                usedCount: 0
              }
            });
          });
      }

      return {
        success: {
          message: "RoundRides and RROfTicketAndFastPass has created successfully",
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
  async UpdateRoundRides(
    @Arg("RoundRidesInputUpdate") roundridesinputupdate: RoundRidesInputUpdate,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundRoundRides = await context.prisma.roundRides.findUnique({
        where: {
          id: roundridesinputupdate.id_roundrides
        }
      });

      if (!foundRoundRides) {
        throw new Error("Error not found data round rides");
      }

      await context.prisma.roundRides.update({
        where: {
          id: roundridesinputupdate.id_roundrides
        },
        data: {
          ridesId: roundridesinputupdate.id_rides,
          startTime: roundridesinputupdate.startTime,
          endTime: roundridesinputupdate.endTime
        }
      });

      return {
        success: {
          message: `Data of rides ${foundRoundRides.startTime} has been successfully updated`,
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
  async DeleteRoundRides(
    @Arg("id_rides") id_rides: string,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      await context.prisma.roundRides.deleteMany({
        where: {
          id: id_rides
        }
      });

      return {
        success: {
          message: "Deleted rides id: " + id_rides,
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

}  