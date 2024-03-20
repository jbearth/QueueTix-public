import "reflect-metadata";
import { Arg, Ctx, Mutation, Query } from "type-graphql";

// thirds-party

// project imports
import { MyContext } from "@resolvers/types/MyContext";
import { RRTicketAndFastPassResponse, MessageResponse } from "@utils/myresponse";
import { RoundRidesOfTicketandFastpass, TypesOfRoundRides } from "@prisma/generated/type-graphql";

export class CRUDRRTicketAndFastPassResolver {

  @Query(() => RRTicketAndFastPassResponse)
  async GetRRTicketAndFastPass(
    @Arg("id_rrticketandfastpass") id_rrticketandfastpass: string,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundRRTicketAndFastPass = await context.prisma.roundRidesOfTicketandFastpass.findUnique({
        where: {
          id: id_rrticketandfastpass
        },
        include: {
          roundrides: true
        }
      });

      if (!foundRRTicketAndFastPass) {
        throw new Error("Error not found data RR Ticket and FastPass");
      }

      return {
        success: {
          message: "Retrive RR Ticket and FastPass Data"
        },
        data: foundRRTicketAndFastPass
      };

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

  @Query(() => [RoundRidesOfTicketandFastpass])
  async GetRRTicketAndFastPassAll(
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundRRTicketAndFastPass = await context.prisma.roundRidesOfTicketandFastpass.findMany({
        include: {
          roundrides: true
        }
      });

      if (!foundRRTicketAndFastPass) {
        throw new Error("Error not found data RR Ticket and FastPass");
      }

      return foundRRTicketAndFastPass;

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
  async UpdateRRTicketAndFastPass(
    @Arg("id_roundrides") id_roundrides: string,
    @Arg("typesofroundrides") typesofroundrides: TypesOfRoundRides,
    @Arg("countofused") countofused: number,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundRRTicketAndFastPassId = await context.prisma.roundRidesOfTicketandFastpass.findFirst({
        where: {
          roundRidesId: id_roundrides,
          types: typesofroundrides,
        }
      });

      console.log("foundRRTicketAndFastPassId.usedCount: ", foundRRTicketAndFastPassId.usedCount);
      console.log("newUsedCount: ", foundRRTicketAndFastPassId.usedCount + countofused);

      const foundRRTicketAndFastPass = await context.prisma.roundRidesOfTicketandFastpass.updateMany({
        where: {
          id: foundRRTicketAndFastPassId.id,
          roundRidesId: id_roundrides
        },
        data: {
          types: typesofroundrides,
          usedCount: foundRRTicketAndFastPassId.usedCount + countofused
        }
      });

      if (!foundRRTicketAndFastPass) {
        throw new Error("Error not found data RR Ticket and FastPass");
      }
      console.log("foundRRTicketAndFastPass: ", foundRRTicketAndFastPass);

      return {
        success: {
          message: "Retrive Ticket and FastPass Data"
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

}  