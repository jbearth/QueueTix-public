import "reflect-metadata";
import * as TypeGraphQL from "type-graphql";
import { Length, IsEmail } from "class-validator";

// project imports
import { IsEmailAlreadyExist } from "./isEmailAlreadyExists";
import { Gender } from "@prisma/generated/type-graphql";
import { ImageUploadInput } from "src/features/uploadFile/ImageUploadInput";

@TypeGraphQL.InputType("UserCreateInputSignUp", {})
export class UserInputSignup {

	@TypeGraphQL.Field(() => String, {
		nullable: false,
	})
	email!: string;

	@TypeGraphQL.Field(() => String, {
		nullable: false,
	})
	role!: "User";

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

	@TypeGraphQL.Field(() => String, {
		nullable: false,
	})
	phone?: string;

	@TypeGraphQL.Field(() => String, {
		nullable: false,
	})
	profilePicture!: string;

}

@TypeGraphQL.InputType("CreateInputSignIn", {})
export class InputSignin {
	@TypeGraphQL.Field(() => String, {
		nullable: false,
	})
	email!: string;

	@TypeGraphQL.Field(() => String, {
		nullable: false,
	})
	@Length(6, 16)
	password!: string;
}

@TypeGraphQL.InputType({})
export class UserInputUpdate {

	@TypeGraphQL.Field(() => String, {
		nullable: false,
	})
	email!: string;

	@TypeGraphQL.Field(() => String, {
		nullable: false,
	})
	role!: "User";

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

	@TypeGraphQL.Field(() => Gender, {
		nullable: false,
	})
	gender!: Gender;

	@TypeGraphQL.Field(() => String, {
		nullable: false,
	})
	dateOfBirth!: Date;

	@TypeGraphQL.Field(() => String, {
		nullable: false,
	})
	phone!: string;

	@TypeGraphQL.Field(() => ImageUploadInput, {
		nullable: false,
	})
	profilePicture!: ImageUploadInput;

}
