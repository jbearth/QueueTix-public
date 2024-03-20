import "reflect-metadata";
import { Ctx, Mutation } from "type-graphql";

// project imports
import { MyContext } from "@resolvers/types/MyContext";
import { MessageResponse } from "@utils/myresponse";

export class ClearEventData {

  @Mutation(() => MessageResponse)
  async ClearEventData(
    @Ctx() context: MyContext,
  ) {
    try {
      context.eventData = {};
      console.log("del eventData: ", context?.eventData || "del");
      return {
        success: {
          message: "Clear event data success"
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