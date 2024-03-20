import "reflect-metadata";
import { Arg, Ctx, Mutation, Query } from "type-graphql";

// thirds-party

// project imports
import { MyContext } from "@resolvers/types/MyContext";
import { MessageResponse, PromotionResponse } from "@utils/myresponse";
import { Promotion } from "@prisma/generated/type-graphql";
import { PromotionInputCreate, PromotionInputUpdate } from "./PromotionInput";
import UploadFile from "@features/uploadFile";

export class CRUDPromotionResolver {

  @Mutation(() => PromotionResponse)
  async GetPromotionMutation(
    @Arg("id_promotion") id_promotion: string,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundPromotion = await context.prisma.promotion.findUnique({
        where: {
          id: id_promotion
        }
      });

      if (!foundPromotion) {
        throw new Error("Error not found promotion data ");
      }

      return {
        success: {
          message: "Successfully retrived promotion data"
        },
        data: foundPromotion
      };

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

  @Query(() => PromotionResponse)
  async GetPromotion(
    @Arg("id_promotion") id_promotion: string,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundPromotion = await context.prisma.promotion.findUnique({
        where: {
          id: id_promotion
        }
      });

      if (!foundPromotion) {
        throw new Error("Error not found promotion data ");
      }

      return {
        success: {
          message: "Successfully retrived promotion data"
        },
        data: foundPromotion
      };

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

  @Query(() => [Promotion])
  async GetPromotionAll(
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundPromotion = await context.prisma.promotion.findMany({
        include: {
          amusementpark: true
        }
      });

      if (!foundPromotion) {
        throw new Error("Error not found all records promotion data");
      }

      // if (foundPromotion.length === 1) {
      //   foundPromotion.sort((a, b) => new Date(a.startDate.getDay()) - new Date(b.startDate));
      // }

      return foundPromotion;

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
  async CreatePromotion(
    @Arg("PromotionInput") promotioninput: PromotionInputCreate,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)

      const {
        id_ticket,
        id_amusementpark,
        title,
        description,
        discountchild,
        discountadult,
        startDate,
        endDate,
        profilePicture
      } = promotioninput;

      // Get profile path
      const profilePicturePath = await UploadFile({ image: profilePicture, context });

      const promotion = await context.prisma.promotion.create({
        data: {
          ticketId: id_ticket,
          amusementparkId: id_amusementpark,
          title,
          description,
          discountchild,
          discountadult,
          startDate: startDate,
          endDate: endDate,
          picture: profilePicturePath
        }
      });

      return {
        success: {
          message: "Successfully created " + promotion.title + " promotion"
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
  @Mutation(() => MessageResponse)
  async UpdatePromotion(
    @Arg("PromotionInput") promotioninput: PromotionInputUpdate,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)

      const {
        id_promotion,
        title,
        description,
        discountchild,
        discountadult,
        startDate,
        endDate,
        profilePicture
      } = promotioninput;

      if (profilePicture.data === "") {
        await context.prisma.promotion.update({
          where: {
            id: id_promotion
          },
          data: {
            title,
            description,
            discountchild,
            discountadult,
            startDate: startDate,
            endDate: endDate,
          }
        });
      } else {
        // Get profile path
        const profilePicturePath = await UploadFile({ image: profilePicture, context });

        await context.prisma.promotion.update({
          where: {
            id: id_promotion
          },
          data: {
            title,
            description,
            discountchild,
            discountadult,
            startDate: startDate,
            endDate: endDate,
            picture: profilePicturePath
          }
        });
      }

      return {
        success: {
          message: "Update Promotion Data Successfully"
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
  @Mutation(() => MessageResponse)
  async DeletePromotion(
    @Arg("id_promotion") id_promotion: string,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundPromotion = await context.prisma.promotion.delete({
        where: {
          id: id_promotion
        }
      });

      if (!foundPromotion) {
        throw new Error("Error not found data promotion");
      }

      return {
        success: {
          message: "Delete Promotion Data Successfully"
        },
        data: foundPromotion
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