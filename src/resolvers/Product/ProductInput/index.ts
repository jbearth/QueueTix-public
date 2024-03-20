import "reflect-metadata";
import * as TypeGraphQL from "type-graphql";
import { IsEmail } from "class-validator";

// project imports
import { TypesOfPurchaseTicket, TypesOfTicket } from "@prisma/generated/type-graphql";

@TypeGraphQL.InputType()
export class PurchaseTicketType {

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  id_ticket!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  id_amusementpark!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  titleticket!: string;

  @TypeGraphQL.Field(() => TypesOfTicket, {
    nullable: false,
  })
  types_of_ticket!: TypesOfTicket;

  @TypeGraphQL.Field(() => TypeGraphQL.Int, {
    nullable: false,
  })
  priceofchild!: number;

  @TypeGraphQL.Field(() => TypeGraphQL.Int, {
    nullable: false,
  })
  amountofchild!: number;

  @TypeGraphQL.Field(() => TypeGraphQL.Int, {
    nullable: false,
  })
  priceofadult!: number;

  @TypeGraphQL.Field(() => TypeGraphQL.Int, {
    nullable: false,
  })
  amountofadult!: number;

  @TypeGraphQL.Field(() => TypeGraphQL.Int, {
    nullable: false,
  })
  totalprice!: number;

  @TypeGraphQL.Field(() => TypeGraphQL.Int, {
    nullable: false,
  })
  maxround!: number;

  @TypeGraphQL.Field(() => String, {
    nullable: true,
  })
  dateofuse?: string;

  @TypeGraphQL.Field(() => TypeGraphQL.Int, {
    nullable: true,
  })
  haspromotion?: number;

}

@TypeGraphQL.InputType({})
export class PurchaseTicketInput {

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  @IsEmail()
  email!: string;

  @TypeGraphQL.Field(() => [PurchaseTicketType], {
    nullable: false
  })
  purchaseticket!: [PurchaseTicketType];
}

@TypeGraphQL.InputType({})
export class UpdatePurchaseTicketInput {

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  @IsEmail()
  email!: string;

  @TypeGraphQL.Field(() => [PurchaseTicketType], {
    nullable: false
  })
  purchaseticket!: PurchaseTicketType;
}
