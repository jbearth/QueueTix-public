import "reflect-metadata";
import { Ctx, Query } from "type-graphql";

import { User } from "../../../prisma/generated/type-graphql";
import { MyContext } from "@resolvers/types/MyContext";
import { isAuthorized } from "@utils/isAuthorized";

export class QueryResolver {

	// รับข้อมูลผู้ใช้ทั้งหมด
	@Query(() => [User])
	async getUsersAll(
		@Ctx() context: MyContext
	): Promise<User[]> {
		// isAuthorized(context.request);
		const user = await context.prisma.user.findMany({
			include: {
				profile: true,
			}
		});

		if (!user) {
			throw new Error("All User not found!!");
		} else {
			await context.prisma.$disconnect();
			return user;
		}
	}

	// @Query(() => QueryProfileResponse)
	// async getOneProfile(
	//   @Arg("userId") userId: string,
	//   @Ctx() context: MyContext,
	// ) {
	//   // isAuthorized(context.request)
	//   const profile = await context.prisma.profile.findFirst({
	//     where: {
	//       id: userId
	//     },
	//   })

	//   if (!profile) {
	//     throw new Error("The specified profile userId could not be found.");
	//   } else {
	//     await context.prisma.$disconnect();
	//     return { data: profile }
	//   }
	// }
}
