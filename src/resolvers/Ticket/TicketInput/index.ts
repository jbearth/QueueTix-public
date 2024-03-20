import { TypesOfTicket } from "@prisma/generated/type-graphql";
import "reflect-metadata";
import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.InputType("TicketCreateInput", {})
export class TicketCreateInput {

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  id_amusementpark!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  title!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  description!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  typesofticket!: TypesOfTicket;

  @TypeGraphQL.Field(() => Number, {
    nullable: false,
  })
  priceofchild!: number;

  @TypeGraphQL.Field(() => Number, {
    nullable: false,
  })
  priceofadult!: number;
}

@TypeGraphQL.InputType("TicketInputUpdate", {})
export class TicketInputUpdate {
  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  id_ticket!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  title!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  description!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  typesofticket!: TypesOfTicket;

  @TypeGraphQL.Field(() => Number, {
    nullable: false,
  })
  priceofchild!: number;

  @TypeGraphQL.Field(() => Number, {
    nullable: false,
  })
  priceofadult!: number;
}
