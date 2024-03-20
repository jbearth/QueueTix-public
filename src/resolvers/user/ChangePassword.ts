import "reflect-metadata";
import { Arg, Ctx, Mutation } from "type-graphql";
import { hash, genSalt } from "bcrypt";
import { verify } from "jsonwebtoken";

// project imports
import { MyContext } from "@resolvers/types/MyContext";
import { ChangePasswordInput } from "./ChangePasswordInput";

export class ChangePasswordResolver {
	@Mutation(() => Boolean, { nullable: true })
	async ChangePassword(
		@Arg("ChangePasswordInput")
		{ token, oldPassword, newPassword }: ChangePasswordInput,
		@Ctx() context: MyContext,
	): Promise<boolean> {
		const forgotPasswordToken = verify(
			token,
			process.env.FORGOT_PASSWORD_TOKEN!,
		) as any;
		if (!forgotPasswordToken) {
			return null;
		}
		if (Date.now() >= forgotPasswordToken.exp * 1000) {
			return null;
		}
		try {
			const employee = await context.prisma.employee.findFirst({
				where: {
					id: forgotPasswordToken.userId,
				},
			});
			if (!employee) {
				return null;
			}
			const salt = await await genSalt(12);
			const hashedPassword = await hash(newPassword, salt);
			employee.password = hashedPassword;
		} catch (e) {
			return null;
		} finally {
			await context.prisma.$disconnect();
		}
		return true;
	}
}
