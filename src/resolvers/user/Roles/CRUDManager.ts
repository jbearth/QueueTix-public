import "reflect-metadata";
import { Arg, Ctx, Mutation, Query } from "type-graphql";

// thirds-party
import { hash, genSalt } from "bcrypt";

// project imports
import { ManagerInputSignup, ManagerInputUpdate } from "../ManagerInput";
import { MessageResponse, ManagerResponse } from "@utils/myresponse";
import { MyContext } from "@resolvers/types/MyContext";
import { Manager } from "@prisma/generated/type-graphql";

export class CRUDManagerResolver {

  // CREATE
  @Mutation(() => MessageResponse)
  async CreateManager(
    @Arg("ManagerInput") managerinput: ManagerInputSignup,
    @Ctx() context: MyContext,
  ) {

    const {
      id_admin,
      id_amusementpark,
      email,
      firstname,
      lastname,
    } = managerinput;

    const salt = await genSalt(12);
    const hashedPassword = await hash("12345678", salt);

    try {
      const manager = await context.prisma.manager.findFirst({
        where: {
          email,
        },
      });

      if (manager !== null) {
        throw new Error("This email already exists!");
      } else {

        // Create account manager
        await context.prisma.manager.create({
          data: {
            adminId: id_admin,
            amusementparkId: id_amusementpark,
            email: email,
            password: hashedPassword,
            fullname: firstname + " " + lastname,
            firstname: firstname,
            lastname: lastname,
            role: "Manager"
          },
        });

        return {
          success: {
            message: `Role manager ${email} has sign up successfully`,
          }
        };
      }
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

  // READ
  @Mutation(() => ManagerResponse)
  async getOneManager(
    @Arg("email") email: string,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const manager = await context.prisma.manager.findFirst({
        where: {
          email,
        }
      });

      if (!manager) {
        throw new Error("The specified manager email could not be found.");
      } else {
        return { manager };
      }

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

  @Query(() => [Manager])
  async getManagerAll(
    @Ctx() context: MyContext
  ): Promise<Manager[]> {
    try {
      // isAuthorized(context.request);
      const manager = await context.prisma.manager.findMany({});

      if (!manager) {
        throw new Error("All manager not found!!");
      } else {
        return manager;
      }

    } catch (e) {
      return e;
    }
  }



  // UPDATE
  @Mutation(() => MessageResponse)
  async UpdateManager(
    @Arg("ManagerInput") managerinput: ManagerInputUpdate,
    @Ctx() context: MyContext,
  ) {

    const {
      oldEmail,
      newEmail,
      fullname,
      firstname,
      lastname,
    } = managerinput;


    try {
      const manager = await context.prisma.manager.findFirst({
        where: {
          email: oldEmail,
        },
      });

      if (manager === null) {
        throw new Error("This email could not be found in the database!");
      } else {

        // Update account manager
        await context.prisma.manager.update({
          where: {
            email: oldEmail,
          },
          data: {
            email: newEmail,
            fullname: fullname,
            firstname: firstname,
            lastname: lastname,
          },
        });
        return {
          success: {
            message: `Data of manager ${oldEmail} has been successfully updated`,
          },
        };
      }
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

  // DELETE
  @Mutation(() => MessageResponse)
  async deleteManager(
    @Arg("id_manager") id: string,
    @Ctx() context: MyContext
  ) {
    try {
      const res = await context.prisma.manager.delete({
        where: {
          id,
        },
      });

      return {
        success: {
          message: "Deleted manager id: " + id,
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
