import "reflect-metadata";
import * as TypeGraphQL from "type-graphql";
import { IsEmail } from "class-validator";

// project imports

@TypeGraphQL.InputType()
export class PurchaseFastpassType {

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  id_amusementpark!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  id_rides!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  id_roundrides!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  id_purchasetickettypes!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  startDateTime!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  endDateTime!: string;

}


@TypeGraphQL.InputType()
export class PurchaseFastpassInput {

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  @IsEmail()
  email!: string;

  @TypeGraphQL.Field(() => Number, {
    nullable: false,
  })
  countofused: number;

  @TypeGraphQL.Field(() => [PurchaseFastpassType], {
    nullable: false,
  })
  pruchasefastpass!: [PurchaseFastpassType];

}