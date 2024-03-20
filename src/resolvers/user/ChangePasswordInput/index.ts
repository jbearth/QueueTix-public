import "reflect-metadata";
import { Field, InputType } from "type-graphql";
import { Length } from "class-validator";

@InputType()
export class ChangePasswordInput {
	@Field()
	token?: string;

	@Field()
	@Length(6, 16)
	oldPassword?: string;

	@Field()
	@Length(6, 16)
	newPassword?: string;
}
