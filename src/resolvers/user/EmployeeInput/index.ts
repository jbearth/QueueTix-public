import "reflect-metadata";
import * as TypeGraphQL from "type-graphql";
import { Length, IsEmail } from "class-validator";
import { Gender, TypesRoleEmployee } from "@prisma/generated/type-graphql/enums";
import { ImageUploadInput } from "src/features/uploadFile/ImageUploadInput";

@TypeGraphQL.InputType("EmployeeCreateInputSignUp", {})
export class EmployeeInputSignup {

  @TypeGraphQL.Field(() => String)
  id_rides?: string;

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

  @TypeGraphQL.Field(_type => Gender, {
    nullable: true,
  })
  gender?: "Male" | "Female" | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
  })
  role?: string | null;

  @TypeGraphQL.Field(_type => TypesRoleEmployee, {
    nullable: true,
  })
  types?: "EntranceEmployee" | "RidesEmployee" | null;

  @TypeGraphQL.Field(_type => ImageUploadInput, {
    nullable: false,
  })
  profilePicture!: ImageUploadInput;
}

@TypeGraphQL.InputType("EmployeeInputUpdate", {})
export class EmployeeInputUpdate {

  @TypeGraphQL.Field(() => String)
  id_rides?: string;

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
  firstname!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  lastname!: string;

  @TypeGraphQL.Field(_type => Gender, {
    nullable: true,
  })
  gender?: "Male" | "Female" | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
  })
  role?: string | null;

  @TypeGraphQL.Field(_type => TypesRoleEmployee, {
    nullable: true,
  })
  types?: "EntranceEmployee" | "RidesEmployee" | null;

  @TypeGraphQL.Field(_type => ImageUploadInput, {
    nullable: false,
  })
  profilePicture!: ImageUploadInput;
}