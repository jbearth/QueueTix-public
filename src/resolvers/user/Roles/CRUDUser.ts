import "reflect-metadata";
import { Arg, Ctx, Mutation, Query } from "type-graphql";

// thirds-party
import dayjs from "dayjs";
// import { hash, genSalt } from "bcrypt";

// project imports
import { UserInputSignup, UserInputUpdate } from "../UserInput";
import { MessageResponse, UserResponse } from "@utils/myresponse";
import { MyContext } from "@resolvers/types/MyContext";
import UploadFile from "@features/uploadFile";
import { User } from "@prisma/generated/type-graphql";
// import { getTransport } from "@features/mail/transport";
// import { generateVerificationEmail } from "@features/mail/verifyAccount";

export class CRUDUserResolver {

	// READ
	@Query(() => UserResponse)
	async getOneUser(
		@Arg("email") email: string,
		@Ctx() context: MyContext
	) {
		try {
			// isAuthorized(context.request)
			const user = await context.prisma.user.findFirst({
				where: {
					email,
				},
				include: {
					profile: true,
				},
			});

			if (!user) {
				throw new Error("The specified user email could not be found.");
			} else {
				return { user };
			}

		} catch (e) {
			return {
				error: {
					message: e.message,
				},
			};
		}
	}

	@Mutation(() => UserResponse)
	async getOneUser2(
		@Arg("email") email: string,
		@Ctx() context: MyContext
	) {
		try {
			// isAuthorized(context.request)
			const user = await context.prisma.user.findFirst({
				where: {
					email,
				},
				include: {
					profile: true,
				},
			});

			if (!user) {
				throw new Error("The specified user email could not be found.");
			} else {
				return { user };
			}

		} catch (e) {
			return {
				error: {
					message: e.message,
				},
			};
		}
	}

	@Query(() => [User])
	async getUsersAll(
		@Ctx() context: MyContext
	): Promise<User[]> {
		try {
			// isAuthorized(context.request);
			const user = await context.prisma.user.findMany({
				include: {
					profile: true,
				}
			});

			if (!user) {
				throw new Error("All User not found!!");
			} else {
				return user;
			}

		} catch (e) {
			return e;
		}
	}

	// CREATE
	@Mutation(() => UserResponse)
	async CreateUser(
		@Arg("UserInput") userinput: UserInputSignup,
		@Ctx() context: MyContext,
	) {

		const {
			email,
			role,
			fullname,
			firstname,
			lastname,
			phone,
			profilePicture,
		} = userinput;

		// const salt = await genSalt(12);
		// const hashedPassword = await hash(password, salt);

		try {
			const user = await context.prisma.user.findFirst({
				where: {
					email,
				},
			});

			if (user !== null) {
				throw new Error("This email already exists!");
			} else {


				// // Create account user
				await context.prisma.user.create({
					data: {
						email: email,
						role: role,
						profile: {
							create: {
								fullname: fullname,
								firstname: firstname,
								lastname: lastname,
								phone: phone,
								profilePicture: profilePicture
							},
						},
					},
					include: {
						profile: true,
					},
				});

				return {
					success: {
						message: `${email} has sign up successfully`,
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

	// UPDATE
	@Mutation(() => UserResponse)
	async UpdateUser(
		@Arg("UpdateUserInput") userinput: UserInputUpdate,
		@Ctx() context: MyContext,
	) {

		const {
			email,
			role,
			fullname,
			firstname,
			lastname,
			gender,
			dateOfBirth,
			phone,
			profilePicture,
		} = userinput;


		try {
			const user = await context.prisma.user.findFirst({
				where: {
					email,
				},
			});

			if (user === null) {
				throw new Error("This email could not be found in the database!");
			} else {

				// Get profile path
				const profilePicturePath = await UploadFile({ image: profilePicture, context });

				// Update account user
				await context.prisma.user.update({
					where: {
						email,
					},
					data: {
						email: email,
						role: role,
					},
				});

				// Update account profile user
				await context.prisma.profile.updateMany({
					where: {
						user: {
							email
						}
					},
					data: {
						fullname: fullname,
						firstname: firstname,
						lastname: lastname,
						gender: gender,
						dateOfBirth: dayjs(dateOfBirth).toDate(),
						phone: phone,
						profilePicture: profilePicturePath,
					}
				});

				return {
					success: {
						message: `Data of user ${email} has been successfully updated`,
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
	async deleteAccount(
		@Arg("id") id: string,
		@Ctx() context: MyContext
	) {
		try {
			const res = await context.prisma.user.delete({
				where: {
					id,
				},
			});
			console.log(res);
			return {
				success: {
					message: "Deleted account id: " + id,
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
