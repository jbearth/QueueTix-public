import "reflect-metadata";
import { Arg, Ctx, Mutation, Query } from "type-graphql";

// thirds-party

// project imports
import { TicketCreateInput, TicketInputUpdate } from "./TicketInput";
import { MyContext } from "@resolvers/types/MyContext";
import { MessageResponse, TicketResponse } from "@utils/myresponse";
import { Ticket } from "@prisma/generated/type-graphql";

export class CRUDTicketResolver {

  // ====================================================================================================
  @Mutation(() => TicketResponse)
  async GetTicketMutation(
    @Arg("id_ticket") id_ticket: string,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundTicket = await context.prisma.ticket.findUnique({
        where: {
          id: id_ticket
        },
        include: {
          typesticket: true,
          ridesofTicket: true
        }
      });

      if (!foundTicket) {
        throw new Error("Error not found data ticket");
      }

      return {
        success: {
          message: "Retrive Ticket Data"
        },
        data: foundTicket
      };

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

  @Query(() => TicketResponse)
  async GetTicket(
    @Arg("id_ticket") id_ticket: string,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundTicket = await context.prisma.ticket.findUnique({
        where: {
          id: id_ticket
        },
        include: {
          typesticket: true,
          ridesofTicket: true
        }
      });

      if (!foundTicket) {
        throw new Error("Error not found data ticket");
      }

      return {
        success: {
          message: "Retrive Ticket Data"
        },
        data: foundTicket
      };

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

  @Query(() => [Ticket])
  async GetTicketAll(
    @Arg("id_amusementpark") id_amusementpark: string,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundTicket = await context.prisma.ticket.findMany({
        where: {
          amusementparkId: id_amusementpark
        },
        include: {
          typesticket: true,
          ridesofTicket: {
            take: 1,
          },
          promotion: true,
          amusementpark: true,
          purchaseticket: true
        }
      });

      if (!foundTicket) {
        throw new Error("Error not found data ticket");
      }

      foundTicket.sort((a, b) => a.typesticket.priceofadult - b.typesticket.priceofadult);

      return foundTicket;

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
  async CreateTicket(
    @Arg("TicketInput") ticketinput: TicketCreateInput,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)

      const {
        id_amusementpark,
        title,
        description,
        typesofticket,
        priceofchild,
        priceofadult
      } = ticketinput;

      const ticket = await context.prisma.ticket.create({
        data: {
          amusementparkId: id_amusementpark,
          title: title,
          description: description,
          typesticket: {
            create: {
              types: typesofticket,
              priceofchild: priceofchild,
              priceofadult: priceofadult
            }
          }
        },
        include: {
          typesticket: true
        }
      });

      const rides = await context.prisma.rides.findMany({});

      if (!rides) {
        throw new Error("All rides not found!!");
      }


      for (let j = 0; j < rides.length; j++) {

        const max_round = ticket.typesticket.types === "SuperVisa" ? 99
          : ticket.typesticket.types === "DreamWorldVisa" ? (rides[j].isSpecial === 1 ? 1 : 99)
            : ticket.typesticket.types === "IncludeRides" ? 1 : 0;

        console.log("max_round: ", max_round);
        console.log("rides_data: ", rides[j].id);

        await context.prisma.ridesofTicket.create({
          data: {
            ticketId: ticket.id,
            ridesId: rides[j].id,
            maxRound: max_round
          }
        });
      }



      return {
        success: {
          message: "Retrive Ticket Data"
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
  @Mutation(() => TicketResponse)
  async UpdateTicket(
    @Arg("TicketInputUpdate") ticketinputupdate: TicketInputUpdate,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)

      const {
        id_ticket,
        title,
        description,
        typesofticket,
        priceofchild,
        priceofadult
      } = ticketinputupdate;

      const foundTicket = await context.prisma.ticket.update({
        where: {
          id: id_ticket
        },
        data: {
          title: title,
          description: description,
          typesticket: {
            update: {
              types: typesofticket,
              priceofchild: priceofchild,
              priceofadult: priceofadult
            }
          }
        },
      });

      if (!foundTicket) {
        throw new Error("Error not found data ticket");
      }

      return {
        success: {
          message: "Retrive Ticket Data"
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
  @Mutation(() => TicketResponse)
  async DeleteTicket(
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundTicket = await context.prisma.ticket.findMany({});

      if (!foundTicket) {
        throw new Error("Error not found data ticket");
      }

      return {
        success: {
          message: "Retrive Ticket Data"
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