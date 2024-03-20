import "reflect-metadata";
import { Arg, Ctx, Mutation, Query } from "type-graphql";

// thirds-party

// project imports
import { MyContext } from "@resolvers/types/MyContext";
import { TicketForEntranceResponse } from "@utils/myresponse";

export class CRUDTicketForEntranceResolver {

  // ====================================================================================================
  @Mutation(() => TicketForEntranceResponse)
  async GetTicketForEntrance(
    @Arg("id_purchasetickettyps") id_purchasetickettyps: string,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundTicketForEntrance = await context.prisma.ticketForEntrance.findFirst({
        where: {
          purchasetickettypesId: id_purchasetickettyps
        }
      });

      if (!foundTicketForEntrance) {
        throw new Error("Error not found data ticket for entrance");
      }

      return {
        success: {
          message: "Retrive Ticket for entrance Data"
        },
        data: foundTicketForEntrance
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