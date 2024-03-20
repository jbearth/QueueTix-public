import "reflect-metadata";
import { Arg, Ctx, Mutation, Query } from "type-graphql";

// thirds-party
import { hash, genSalt } from "bcrypt";

// project imports
import { AdminInputSignup, AdminInputUpdate } from "../AdminInput";
import { MessageResponse } from "@utils/myresponse";
import { MyContext } from "@resolvers/types/MyContext";
import { Admin } from "@prisma/generated/type-graphql";

export class CRUDAdminResolver {

  // CREATE
  @Mutation(() => MessageResponse)
  async CreateAdmin(
    @Arg("AdminInput") admininput: AdminInputSignup,
    @Ctx() context: MyContext,
  ) {

    const {
      email,
      password,
      fullname,
      firstname,
      lastname,
    } = admininput;

    const salt = await genSalt(12);
    const hashedPassword = await hash(password, salt);

    try {
      const admin = await context.prisma.admin.findFirst({
        where: {
          email,
        },
      });

      if (admin !== null) {
        throw new Error("This email already exists!");
      } else {

        // Create account admin
        await context.prisma.admin.create({
          data: {
            email: email,
            password: hashedPassword,
            fullname: fullname,
            firstname: firstname,
            lastname: lastname
          },
        });

        return {
          success: {
            message: `Role Admin ${email} has sign up successfully`,
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
  @Query(() => Admin)
  async getOneAdmin(
    @Arg("email") email: string,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const admin = await context.prisma.admin.findFirst({
        where: {
          email,
        }
      });

      if (!admin) {
        throw new Error("The specified admin email could not be found.");
      } else {
        return { admin };
      }

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

  @Query(() => [Admin])
  async getAdminAll(
    @Ctx() context: MyContext
  ): Promise<Admin[]> {
    try {
      // isAuthorized(context.request);
      const admin = await context.prisma.admin.findMany({});

      if (!admin) {
        throw new Error("All admin not found!!");
      } else {
        return admin;
      }

    } catch (e) {
      return e;
    }
  }



  // UPDATE
  @Mutation(() => MessageResponse)
  async UpdateAdmin(
    @Arg("AdminInput") admininput: AdminInputUpdate,
    @Ctx() context: MyContext,
  ) {

    const {
      oldEmail,
      newEmail,
      password,
      fullname,
      firstname,
      lastname,
    } = admininput;

    const salt = await genSalt(12);
    const hashedPassword = await hash(password, salt);

    try {
      const admin = await context.prisma.admin.findFirst({
        where: {
          email: oldEmail,
        },
      });

      if (admin === null) {
        throw new Error("This email could not be found in the database!");
      } else {

        // Update account admin
        await context.prisma.admin.update({
          where: {
            email: oldEmail,
          },
          data: {
            email: newEmail,
            password: hashedPassword,
            fullname: fullname,
            firstname: firstname,
            lastname: lastname,
          },
        });
        return {
          success: {
            message: `Data of admin ${oldEmail} has been successfully updated`,
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
  async deleteAdmin(
    @Arg("id") id: string,
    @Ctx() context: MyContext
  ) {
    try {
      const res = await context.prisma.admin.delete({
        where: {
          id,
        },
      });
      console.log(res);
      return {
        success: {
          message: "Deleted admin id: " + id,
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
