import { FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

// Middleware function to verify the token
export function isAuthorized(request: FastifyRequest) {
	const authHeader = request.headers.authorization;
	if (authHeader) {
		// Bearer [token]
		const token = authHeader.split("Bearer ")[1];
		if (token) {
			const privateKey = Buffer.from(
				process.env.ACCESS_TOKEN_PRIVATE_KEY,
				"base64",
			).toString("ascii");

			try {
				const user = jwt.verify(token, privateKey, {
					algorithms: ["HS512"],
				});
				return user;
			} catch (err) {
				throw new Error("Invalid/Expired token");
			}
		}
		throw new Error("Authentication token must be 'Bearer [token]");
	}
	throw new Error("Authorization header must be provided");
}
