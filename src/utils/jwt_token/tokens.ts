import { signJwt } from "./jwt";
import { User } from "../../../prisma/generated/type-graphql";

// Exprires Tokens
const accessTokenExpiresIn = Number(process.env.ACCESSTOKENEXPIRESIN!);
const refreshTokenExpiresIn = Number(process.env.REFRESHTOKENEXPIRESIN!);

// Sign JWT Tokens
export const signTokens = (user: any) => {
	const access_token = signJwt(user, process.env.ACCESS_TOKEN_PRIVATE_KEY!, {
		algorithm: "HS512",
		expiresIn: `${accessTokenExpiresIn}m`,
	});

	const refresh_token = signJwt(
		{ id: user?.id },
		process.env.REFRESH_TOKEN_PRIVATE_KEY!,
		{
			algorithm: "HS512",
			expiresIn: `${refreshTokenExpiresIn}m`,
		},
	);

	return { access_token, refresh_token };
};

export const forgotPasswordToken = (user: any) => {
	return signJwt({ id: user.id }, process.env.FORGOT_PASSWORD_TOKEN!, {
		algorithm: "HS512",
		expiresIn: "1m",
	});
};
