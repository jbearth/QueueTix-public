import "reflect-metadata";
import { ObjectType, Field } from "type-graphql";
import {
	Profile,
	User,
	Ticket,
	AmusementPark,
	Rides,
	RoundRides,
	Promotion,
	PurchaseTicketFastpass,
	PurchaseTicket,
	RoundRidesOfTicketandFastpass,
	Admin,
	Manager,
	Employee,
	TicketForEntrance
} from "../../prisma/generated/type-graphql/models";
// import { Posts } from '../entities/posts';

@ObjectType()
class Error {
	@Field()
	message: string;
}

@ObjectType()
class Success {
	@Field()
	message: string;
}

@ObjectType()
class Token {
	@Field()
	access_token: string;
	@Field()
	refresh_token: string;
}

@ObjectType()
export class MessageResponse {
	@Field(() => Success, { nullable: true })
	success?: Success;
	@Field(() => Error, { nullable: true })
	error?: Error;
}

@ObjectType()
export class QRCodeDataResponse {
	@Field(() => String, { nullable: false })
	result!: string;
	@Field(() => String, { nullable: true })
	ref1?: string;
	@Field(() => String, { nullable: true })
	ref2?: string;
}

@ObjectType()
export class QRCodeResponse {
	@Field(() => Success, { nullable: true })
	success?: Success;
	@Field(() => Error, { nullable: true })
	error?: Error;
	@Field(() => QRCodeDataResponse, { nullable: false })
	data!: QRCodeDataResponse;
}

@ObjectType()
export class UserResponse {
	@Field(() => Success, { nullable: true })
	success?: Success;
	@Field(() => Error, { nullable: true })
	error?: Error;
	@Field(() => User, { nullable: true })
	user?: User;
	@Field(() => Token, { nullable: true })
	token?: Token;
}

@ObjectType()
export class AdminResponse {
	@Field(() => Success, { nullable: true })
	success?: Success;
	@Field(() => Error, { nullable: true })
	error?: Error;
	@Field(() => Admin, { nullable: true })
	admin?: Admin;
	@Field(() => Token, { nullable: true })
	token?: Token;
}
@ObjectType()
export class ManagerResponse {
	@Field(() => Success, { nullable: true })
	success?: Success;
	@Field(() => Error, { nullable: true })
	error?: Error;
	@Field(() => Manager, { nullable: true })
	manager?: Manager;
	@Field(() => Token, { nullable: true })
	token?: Token;
}
@ObjectType()
export class EmployeeResponse {
	@Field(() => Success, { nullable: true })
	success?: Success;
	@Field(() => Error, { nullable: true })
	error?: Error;
	@Field(() => Employee, { nullable: true })
	employee?: Employee;
	@Field(() => Token, { nullable: true })
	token?: Token;
}

@ObjectType()
export class QueryProfileResponse {
	@Field(() => Profile, { nullable: true })
	data?: Profile;
}

@ObjectType()
export class UploadResponse {
	@Field(() => Success, { nullable: true })
	success?: Success;
	@Field(() => Error, { nullable: true })
	error?: Error;
	@Field(() => String, { nullable: false })
	url!: string;
}

@ObjectType()
export class VerifyResponse {
	@Field(() => Success, { nullable: true })
	success?: Success;
	@Field(() => Error, { nullable: true })
	error?: Error;
	@Field(() => String, { nullable: false })
	data!: string;
}

@ObjectType()
export class TicketResponse {
	@Field(() => Success, { nullable: true })
	success?: Success;
	@Field(() => Error, { nullable: true })
	error?: Error;
	@Field(() => Ticket, { nullable: true })
	data?: Ticket;
}

@ObjectType()
export class AmusementParkResponse {
	@Field(() => Success, { nullable: true })
	success?: Success;
	@Field(() => Error, { nullable: true })
	error?: Error;
	@Field(() => AmusementPark, { nullable: false })
	data!: AmusementPark;
}

@ObjectType()
export class RidesResponse {
	@Field(() => Success, { nullable: true })
	success?: Success;
	@Field(() => Error, { nullable: true })
	error?: Error;
	@Field(() => Rides, { nullable: false })
	data!: Rides;
}

@ObjectType()
export class RoundRidesResponse {
	@Field(() => Success, { nullable: true })
	success?: Success;
	@Field(() => Error, { nullable: true })
	error?: Error;
	@Field(() => RoundRides, { nullable: false })
	data!: RoundRides;
}

@ObjectType()
export class PromotionResponse {
	@Field(() => Success, { nullable: true })
	success?: Success;
	@Field(() => Error, { nullable: true })
	error?: Error;
	@Field(() => Promotion, { nullable: false })
	data!: Promotion;
}

@ObjectType()
export class PurchaseTicketResponse {
	@Field(() => Success, { nullable: true })
	success?: Success;
	@Field(() => Error, { nullable: true })
	error?: Error;
	@Field(() => String, { nullable: false })
	data!: string;
}

@ObjectType()
export class PurchaseFastpassResponse {
	@Field(() => Success, { nullable: true })
	success?: Success;
	@Field(() => Error, { nullable: true })
	error?: Error;
	@Field(() => PurchaseTicketFastpass, { nullable: false })
	data!: PurchaseTicketFastpass;
}

@ObjectType()
export class RRTicketAndFastPassResponse {
	@Field(() => Success, { nullable: true })
	success?: Success;
	@Field(() => Error, { nullable: true })
	error?: Error;
	@Field(() => PurchaseTicketFastpass, { nullable: false })
	data!: RoundRidesOfTicketandFastpass;
}

@ObjectType()
export class TicketForEntranceResponse {
	@Field(() => Success, { nullable: true })
	success?: Success;
	@Field(() => Error, { nullable: true })
	error?: Error;
	@Field(() => TicketForEntrance, { nullable: false })
	data!: TicketForEntrance;
}
