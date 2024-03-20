import { PrismaClient, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime";
import { FastifyReply, FastifyRequest } from "fastify";
import { Redis } from "ioredis";

export interface MyContext {
	prisma: PrismaClient<
		Prisma.PrismaClientOptions,
		never,
		Prisma.RejectOnNotFound | Prisma.RejectPerOperation,
		DefaultArgs
	>;
	request: FastifyRequest;
	reply: FastifyReply;
	eventData: unknown;
	redis: Redis;
}
