import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ApolloServer } from "@apollo/server";
import fastifyApollo, {
	fastifyApolloDrainPlugin,
} from "@as-integrations/fastify";
// import fastifyCompress from "@fastify/compress";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
// import { verify } from "jsonwebtoken";
import { redis } from "./redis";

// project imports
import { createSchema } from "@utils/createSchema";
import { MyContext } from "@resolvers/types/MyContext";
import PrismaClientPlugin from "./prismaClient";

(async () => {
	const envToLogger = {
		development: {
			transport: {
				target: "pino-pretty",
				options: {
					colorize: true,
					timestampKey: "time",
					translateTime: "HH:MM:ss Z",
					ignore: "pid,hostname",
				},
			},
		},
		production: false,
		test: true,
	};

	const fastify: FastifyInstance = Fastify({
		logger: envToLogger["development"] ?? true,
	});

	const schema = await createSchema();

	const apolloServer = new ApolloServer<MyContext>({
		introspection: true,
		schema,
		plugins: [fastifyApolloDrainPlugin(fastify)],
	});

	await apolloServer.start();
	await fastify.register(PrismaClientPlugin);
	await fastify.register(fastifyRateLimit, {
		global: true,
		max: 10000,
		timeWindow: 1000,
		hook: "onRequest",
	});
	// fastify.setErrorHandler(function (error, request, reply) {
	//   if (error.statusCode === 429) {
	//     reply.code(429)
	//     error.message = 'การส่ง request ไปยังเซิร์ฟเวอร์ถึงขีดจำกัดแล้ว'
	//   }
	//   reply.send(error)
	// })
	// fastify.setNotFoundHandler({
	//   preHandler: fastify.rateLimit({
	//     max: 100,
	//     timeWindow: 500
	//   })
	// }, function (request, reply) {

	//   reply.code(404).send({ hello: 'world' })
	// })
	await fastify.register(fastifyCors, {
		origin: ["https://21c2-1-47-8-33.ngrok-free.app", process.env.CLIENT_URL],
	});
	await fastify.register(fastifyHelmet, {
		contentSecurityPolicy: false,
	});
	// await fastify.register(compress);

	let eventData: unknown = null;

	fastify.post("/webhook/payment/qrcode", async (request, reply) => {
		try {
			eventData = await request.body; // Fastify automatically parses JSON data
			console.log("webhook: ", eventData);
			reply.status(200).send("Webhook received successfully");
		} catch (error) {
			reply.status(500).send("Internal server error");
		}
	});

	await fastify.register(fastifyApollo(apolloServer), {
		context: (
			request: FastifyRequest,
			reply: FastifyReply,
		): Promise<MyContext> => {
			return Promise.resolve({
				prisma: fastify.prisma,
				request,
				reply,
				eventData,
				redis
			});
		},
	});

	// fastify.route(function (_req, res, next) {
	//   res.setHeader('Access-Control-Allow-Origin', '*'); //หรือใส่แค่เฉพาะ domain ที่ต้องการได้
	//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	//   res.setHeader('Access-Control-Allow-Credentials', "true");
	//   next();
	// });

	const port = Number(process.env.PORT) || 5000;
	fastify.listen({ port, host: "localhost" }, function (err) {
		if (err) {
			console.log("UNHANDLED REJECTION 🔥🔥 Shutting down...");
			console.log(err);
			process.exit(1);
		}
		console.log(`🚀 Server ready at: http://localhost:${port}/graphql`);
	});
})();
