import "reflect-metadata";
import * as TypeGraphQL from "type-graphql";
import { Length, IsEmail } from "class-validator";

@TypeGraphQL.InputType("ManagerCreateInputSignUp", {})
export class ManagerInputSignup {

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  id_admin!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  id_amusementpark!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  @IsEmail()
  email!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  firstname!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  lastname!: string;
}

@TypeGraphQL.InputType("ManagerCreateInputSignIn", {})
export class ManagerInputSignin {
  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  @IsEmail()
  email!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  @Length(6, 16)
  password!: string;
}

@TypeGraphQL.InputType("ManagerInputUpdate", {})
export class ManagerInputUpdate {

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  @IsEmail()
  oldEmail!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  @IsEmail()
  newEmail!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  fullname!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  firstname!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  lastname!: string;
}