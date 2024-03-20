import { SignOptions, sign, verify } from "jsonwebtoken";

export const signJwt = (
	payload: object,
	key: string,
	options?: SignOptions,
) => {
	const privateKey = Buffer.from(key, "base64").toString("ascii");

	return sign(payload, privateKey, {
		...(options && options),
		algorithm: "HS512",
	});
};

export const verifyJwt = <T>(token: string, key: string): T | null => {
	const privateKey = Buffer.from(key, "base64").toString("ascii");
	// console.log("buffer_public:\n", publicKey)

	try {
		return verify(token, privateKey, {
			algorithms: ["HS512"],
		}) as T;
	} catch (error) {
		return null;
	}
};
