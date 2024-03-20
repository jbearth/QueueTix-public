import "reflect-metadata";
import * as TypeGraphQL from "type-graphql";
import { Length, IsEmail } from "class-validator";

@TypeGraphQL.InputType("AdminCreateInputSignUp", {})
export class AdminInputSignup {

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

@TypeGraphQL.InputType("AdminCreateInputSignIn", {})
export class AdminInputSignin {
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

@TypeGraphQL.InputType("AdminInputUpdate", {})
export class AdminInputUpdate {

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
  @Length(6, 16)
  password!: string;

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
