import "reflect-metadata";
import { Arg, Ctx, Mutation, Query } from "type-graphql";

// thirds-party
import { hash, genSalt } from "bcrypt";
import { Employee } from "@prisma/generated/type-graphql";

// project imports
import { EmployeeInputSignup, EmployeeInputUpdate } from "../EmployeeInput";
import { MessageResponse, EmployeeResponse } from "@utils/myresponse";
import { MyContext } from "@resolvers/types/MyContext";
import UploadFile from "@features/uploadFile";

export class CRUDEmployeeResolver {

  // CREATE
  @Mutation(() => MessageResponse)
  async CreateEmployee(
    @Arg("EmployeeInput") employeeinput: EmployeeInputSignup,
    @Ctx() context: MyContext,
  ) {

    const {
      id_rides,
      id_amusementpark,
      email,
      firstname,
      lastname,
      gender,
      role,
      types,
      profilePicture
    } = employeeinput;

    const salt = await genSalt(12);
    const hashedPassword = await hash("12345678", salt);

    try {
      const employee = await context.prisma.employee.findFirst({
        where: {
          email,
        },
      });

      if (employee !== null) {
        throw new Error("This email already exists!");
      } else {

        // Get profile path
        const profilePicturePath = await UploadFile({ image: profilePicture, context });

        // Create account employee
        if (id_rides === "") {
          await context.prisma.employee.create({
            data: {
              amusementparkId: id_amusementpark,
              email: email,
              password: hashedPassword,
              fullname: firstname + " " + lastname,
              firstname: firstname,
              lastname: lastname,
              gender: gender,
              role: role,
              types: types,
              profilePicture: profilePicturePath
            },
          });
        } else {
          await context.prisma.employee.create({
            data: {
              ridesId: id_rides,
              amusementparkId: id_amusementpark,
              email: email,
              password: hashedPassword,
              fullname: firstname + " " + lastname,
              firstname: firstname,
              lastname: lastname,
              gender: gender,
              role: role,
              types: types,
              profilePicture: profilePicturePath
            },
          });
        }

        return {
          success: {
            message: `Role employee ${email} has sign up successfully`,
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
  @Mutation(() => EmployeeResponse)
  async getOneEmployee(
    @Arg("email") email: string,
    @Ctx() context: MyContext
  ) {
    try {
      // isAuthorized(context.request)
      const employee = await context.prisma.employee.findFirst({
        where: {
          email,
        }
      });

      if (!employee) {
        throw new Error("The specified employee email could not be found.");
      } else {
        return { employee };
      }

    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }

  @Query(() => [Employee])
  async getEmployeeAll(
    @Ctx() context: MyContext
  ): Promise<Employee[]> {
    try {
      // isAuthorized(context.request);
      const employee = await context.prisma.employee.findMany({
        include: {
          amusementpark: true,
          rides: true
        }
      });

      if (!employee) {
        throw new Error("All employee not found!!");
      } else {
        return employee;
      }

    } catch (e) {
      return e;
    }
  }



  // UPDATE
  @Mutation(() => MessageResponse)
  async UpdateEmployee(
    @Arg("EmployeeInput") employeeinput: EmployeeInputUpdate,
    @Ctx() context: MyContext,
  ) {

    const {
      id_rides,
      oldEmail,
      newEmail,
      firstname,
      lastname,
      gender,
      role,
      types,
      profilePicture
    } = employeeinput;

    try {
      const employee = await context.prisma.employee.findFirst({
        where: {
          email: oldEmail,
        },
      });

      if (employee === null) {
        throw new Error("This email could not be found in the database!");
      } else {

        // Update account employee
        if (profilePicture.data === "") {
          if (id_rides === "") {
            await context.prisma.employee.update({
              where: {
                email: oldEmail,
              },
              data: {
                email: newEmail,
                fullname: firstname + " " + lastname,
                firstname: firstname,
                lastname: lastname,
                gender: gender,
                role: role,
                types: types,
              },
            });
          } else {
            await context.prisma.employee.update({
              where: {
                email: oldEmail,
              },
              data: {
                ridesId: id_rides,
                email: newEmail,
                fullname: firstname + " " + lastname,
                firstname: firstname,
                lastname: lastname,
                gender: gender,
                role: role,
                types: types,
              },
            });
          }
        } else {
          // Get profile path
          const profilePicturePath = await UploadFile({ image: profilePicture, context });
          if (id_rides === "") {
            await context.prisma.employee.update({
              where: {
                email: oldEmail,
              },
              data: {
                email: newEmail,
                fullname: firstname + " " + lastname,
                firstname: firstname,
                lastname: lastname,
                gender: gender,
                role: role,
                types: types,
                profilePicture: profilePicturePath
              },
            });
          } else {
            await context.prisma.employee.update({
              where: {
                email: oldEmail,
              },
              data: {
                ridesId: id_rides,
                email: newEmail,
                fullname: firstname + " " + lastname,
                firstname: firstname,
                lastname: lastname,
                gender: gender,
                role: role,
                types: types,
                profilePicture: profilePicturePath
              },
            });
          }
        }
        return {
          success: {
            message: `Data of employee ${oldEmail} has been successfully updated`,
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
  async deleteEmployee(
    @Arg("id_employee") id: string,
    @Ctx() context: MyContext
  ) {
    try {
      const res = await context.prisma.employee.delete({
        where: {
          id,
        },
      });
      console.log(res);
      return {
        success: {
          message: "Deleted employee id: " + id,
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
