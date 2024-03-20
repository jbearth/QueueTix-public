import "reflect-metadata";
import { Arg, Ctx, Mutation } from "type-graphql";

// project imports
import { MyContext } from "@resolvers/types/MyContext";
import { User } from "@prisma/generated/type-graphql";
import { forgotPasswordToken as forgotPasswordTokenHandler } from "@utils/jwt_token/tokens";
import { getTransport } from "@features/mail/transport";
import { generateForgetPSWAccount } from "src/features/mail/forgetPSWAccount";

export class ForgetPassowrdResolver {
	@Mutation(() => Boolean, { nullable: true })
	async ForgotPassword(
		@Arg("email") email: string,
		@Ctx() context: MyContext
	): Promise<boolean> {
		let user: User;
		try {
			const foundUser = await context.prisma.employee.findUnique({
				where: {
					email,
				},
			});
			if (!foundUser) {
				return null;
			}

			// user = foundUser;
		} catch (e) {
			return null;
		} finally {
			await context.prisma.$disconnect();
		}

		const forgotPasswordToken = forgotPasswordTokenHandler(user);
		const transporter = await getTransport();
		// const mailOptions = generateForgetPSWAccount({
		// 	username: user?.name,
		// 	email: user?.email,
		// 	// token: forgotPasswordToken,
		// 	token:
		// 		"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNjg5MzUzMjE3LCJleHAiOjE2ODkzNTMyNzd9.RWymp8NDn_iAeRYuGaaHPqtntTp2Gjt3x6zfSls3ds96S4bizUELbyXg-cF9Iv_ggU-NXizg_HAYKB_xXcMf2g",
		// });

		// transporter.sendMail(mailOptions, function (error, info) {
		// 	if (error) {
		// 		console.log(error);
		// 		return false;
		// 	} else {
		// 		console.log("Message sent: %s", info.messageId);
		// 		return true;
		// 	}
		// });
	}
}
