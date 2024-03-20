import "reflect-metadata";
import { Arg, Ctx, Mutation } from "type-graphql";
import { compare } from "bcrypt";

// project imports
import { InputSignin } from "./UserInput";
import { MyContext } from "@resolvers/types/MyContext";
import { AdminResponse, ManagerResponse, EmployeeResponse } from "@utils/myresponse";
import { signTokens } from "@utils/jwt_token/tokens";
// import { redis } from "src/redis";
// import { generateOTP } from "@features/mail/OTP/generateOTP";
// import { generateVerificationEmail } from "@features/mail/verifyAccount";

export class AdminSignInResolver {
	@Mutation(() => AdminResponse)
	async AdminLogin(
		@Arg("InputSignin") { email, password }: InputSignin,
		@Ctx() context: MyContext,
	) {
		try {
			// Find admin by email
			const admin = await context.prisma.admin.findUnique({
				where: {
					email,
				},
			});
			console.log("admin: ", admin);

			// Compare passwords
			const isValidPassword = await compare(
				password,
				admin ? admin.password : "",
			);
			console.log("valid: ", isValidPassword);

			if (!admin || !isValidPassword) {
				throw new Error();
			}

			//Sign JWT Tokens
			const { access_token, refresh_token } = signTokens(admin);

			// Verify with OTP for user role admin
			// if (user?.role !== "USER") {
			//   const otp = generateOTP();

			//   // Store OTP in Redis
			//   await redis.set(email, otp);

			//   // Send OTP via email
			//   generateVerificationEmail({
			//     username: user?.name,
			//     email: email,
			//     otp: otp
			//   })
			// }

			return {
				success: {
					message: "Signin role admin Success",
				},
				admin,
				token: {
					access_token,
					refresh_token,
				},
			};
		} catch (e) {
			return {
				error: {
					message: "Invalid credentials",
				},
			};
		} finally {
			await context.prisma.$disconnect();
		}
	}
}

export class ManagerSignInResolver {
	@Mutation(() => ManagerResponse)
	async ManagerLogin(
		@Arg("InputSignin") { email, password }: InputSignin,
		@Ctx() context: MyContext,
	) {
		try {
			// Find admin by email
			const manager = await context.prisma.manager.findUnique({
				where: {
					email,
				},
			});
			console.log("manager: ", manager);

			// Compare passwords
			const isValidPassword = await compare(
				password,
				manager ? manager.password : "",
			);
			console.log("valid: ", isValidPassword);

			if (!manager || !isValidPassword) {
				throw new Error();
			}

			//Sign JWT Tokens
			const { access_token, refresh_token } = signTokens(manager);

			// Verify with OTP for user role admin
			// if (user?.role !== "USER") {
			//   const otp = generateOTP();

			//   // Store OTP in Redis
			//   await redis.set(email, otp);

			//   // Send OTP via email
			//   generateVerificationEmail({
			//     username: user?.name,
			//     email: email,
			//     otp: otp
			//   })
			// }

			return {
				success: {
					message: "Signin role manager Success",
				},
				manager,
				token: {
					access_token,
					refresh_token,
				},
			};
		} catch (e) {
			return {
				error: {
					message: "Invalid credentials",
				},
			};
		} finally {
			await context.prisma.$disconnect();
		}
	}
}

export class EmployeeSignInResolver {
	@Mutation(() => EmployeeResponse)
	async EmployeeLogin(
		@Arg("InputSignin") { email, password }: InputSignin,
		@Ctx() context: MyContext,
	) {
		try {
			// Find admin by email
			const employee = await context.prisma.employee.findUnique({
				where: {
					email,
				},
			});
			console.log("employee: ", employee);

			// Compare passwords
			const isValidPassword = await compare(
				password,
				employee ? employee.password : "",
			);
			console.log("valid: ", isValidPassword);

			if (!employee || !isValidPassword) {
				throw new Error();
			}

			//Sign JWT Tokens
			const { access_token, refresh_token } = signTokens(employee);

			// Verify with OTP for user role admin
			// if (user?.role !== "USER") {
			//   const otp = generateOTP();

			//   // Store OTP in Redis
			//   await redis.set(email, otp);

			//   // Send OTP via email
			//   generateVerificationEmail({
			//     username: user?.name,
			//     email: email,
			//     otp: otp
			//   })
			// }

			return {
				success: {
					message: "Signin role employee Success",
				},
				employee,
				token: {
					access_token,
					refresh_token,
				},
			};
		} catch (e) {
			return {
				error: {
					message: "Invalid credentials",
				},
			};
		} finally {
			await context.prisma.$disconnect();
		}
	}
}
