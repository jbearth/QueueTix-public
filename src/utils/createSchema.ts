import { buildSchema } from "type-graphql";

// Resolver Users
import {
	AdminSignInResolver,
	ManagerSignInResolver,
	EmployeeSignInResolver,
	ForgetPassowrdResolver,
	ChangePasswordResolver,
	VerifyAccountResolver
} from "@resolvers/user";

import { CRUDUserResolver, CRUDEmployeeResolver, CRUDManagerResolver, CRUDAdminResolver } from "@resolvers/user/Roles";
import { CRUDAmusementParkResolver } from "@resolvers/AmusementPark";
import { CRUDTicketResolver } from "@resolvers/Ticket";
import { CRUDRidesResolver } from "@resolvers/Rides";
import { CRUDRoundRidesResolver } from "@resolvers/Rides/RoundRides/CRUDRoundRides";
import { CRUDPromotionResolver } from "@resolvers/Promotion";
import { CRUDPurchaseFastpassResolver } from "@resolvers/Fastpass/CRUDPurchaseFastpass";
import { QRCodePayment } from "@resolvers/Payment/QRCodePayment";
import { PurchaseTicketResolver } from "@resolvers/Product";
import { ClearEventData } from "@features/payment/ClearEventData";
import { CRUDRRTicketAndFastPassResolver } from "@resolvers/Rides";
import { CRUDTicketForEntranceResolver } from "@resolvers/TicketForEntrance";

export const createSchema = () =>
	buildSchema({
		resolvers: [
			CRUDUserResolver,
			CRUDManagerResolver,
			CRUDAdminResolver,
			CRUDTicketForEntranceResolver,

			AdminSignInResolver,
			ManagerSignInResolver,
			CRUDEmployeeResolver,
			EmployeeSignInResolver,

			ForgetPassowrdResolver,
			ChangePasswordResolver,
			// QueryResolver,
			VerifyAccountResolver,

			QRCodePayment,

			PurchaseTicketResolver,
			ClearEventData,

			CRUDAmusementParkResolver,
			CRUDTicketResolver,
			CRUDRidesResolver,
			CRUDRoundRidesResolver,
			CRUDPromotionResolver,
			CRUDPurchaseFastpassResolver,
			CRUDRRTicketAndFastPassResolver
		],
	});
