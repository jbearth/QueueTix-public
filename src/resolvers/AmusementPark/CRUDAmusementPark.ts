import "reflect-metadata";
import { Arg, Ctx, Mutation, Query } from "type-graphql";

// thirds-party

// project imports
import { MyContext } from "@resolvers/types/MyContext";
import { AmusementParkResponse, MessageResponse } from "@utils/myresponse";
import { AmusementPark } from "@prisma/generated/type-graphql";
import { AmusementParkInputSignup, AmusementParkInputUpdate } from "./AmusementParkInput";
import UploadFile from "@features/uploadFile";

export class CRUDAmusementParkResolver {

  @Query(() => AmusementParkResponse)
  async GetAmusementPark(
    @Arg("id_amusementpark") id_amusementpark: string,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundAmusementPark = await context.prisma.amusementPark.findUnique({
        where: {
          id: id_amusementpark
        },
        include: {
          amusementparkmaps: true,
          promotion: true
        }
      });

      if (!foundAmusementPark) {
        throw new Error("Error not found data amusementpark");
      }

      return {
        success: {
          message: "Retrive AmusementPark Data"
        },
        data: foundAmusementPark
      };

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

  @Query(() => [AmusementPark])
  async GetAmusementParkAll(
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundAmusementPark = await context.prisma.amusementPark.findMany({
        include: {
          amusementparkmaps: true,
          promotion: true
        }
      });

      if (!foundAmusementPark) {
        throw new Error("Error not found data amusementpark");
      }

      return foundAmusementPark;

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }


  // ====================================================================================================
  @Mutation(() => AmusementParkResponse)
  async CreateAmusementPark(
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundAmusementPark = await context.prisma.amusementPark.findMany({});

      if (!foundAmusementPark) {
        throw new Error("Error not found data amusementpark");
      }

      return {
        success: {
          message: "Retrive AmusementPark Data"
        },
        data: foundAmusementPark
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
  async UpdateAmusementPark(
    @Arg("UpdateAmusementParkInput") updateamusementparkinput: AmusementParkInputUpdate,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)

      const {
        id_amusementpark,
        title,
        description,
        email_contact,
        phone_contact,
        opening_hours,
        closing_hours,
        profilePicture,
        latitude,
        longitude
      } = updateamusementparkinput;

      if (profilePicture.data === "") {
        const amusementPark = await context.prisma.amusementPark.update({
          where: {
            id: id_amusementpark
          },
          data: {
            name: title,
            description: description,
            email: email_contact,
            phone: phone_contact,
            openinghours: opening_hours,
            closinghours: closing_hours,
            amusementparkmaps: {
              update: {
                latitude,
                longitude
              }
            }
          }
        });
        return {
          success: {
            message: "Retrive AmusementPark Data"
          },
          data: amusementPark
        };
      } else {
        // Get profile path
        const profilePicturePath = await UploadFile({ image: profilePicture, context });

        const amusementPark = await context.prisma.amusementPark.update({
          where: {
            id: id_amusementpark
          },
          data: {
            name: title,
            description: description,
            email: email_contact,
            phone: phone_contact,
            openinghours: opening_hours,
            closinghours: closing_hours,
            picture: profilePicturePath,
            amusementparkmaps: {
              update: {
                latitude,
                longitude
              }
            }
          }
        });
        return {
          success: {
            message: "Retrive AmusementPark Data"
          },
          data: amusementPark
        };
      }



    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }


  // ====================================================================================================
  @Mutation(() => AmusementParkResponse)
  async DeleteAmusementPark(
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const foundAmusementPark = await context.prisma.amusementPark.findMany({});

      if (!foundAmusementPark) {
        throw new Error("Error not found data amusementpark");
      }

      return {
        success: {
          message: "Retrive AmusementPark Data"
        },
        data: foundAmusementPark
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