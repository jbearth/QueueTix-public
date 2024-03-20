import { ImageUploadInput } from "@features/uploadFile/ImageUploadInput";
import "reflect-metadata";
import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.InputType("AmusementParkCreateInputSignUp", {})
export class AmusementParkInputSignup {

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  id_amusementpark!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
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

@TypeGraphQL.InputType("AmusementParkInputUpdate", {})
export class AmusementParkInputUpdate {

  @TypeGraphQL.Field(() => String)
  id_amusementpark?: string;

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
  email_contact!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  phone_contact!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  opening_hours!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  closing_hours!: string;

  @TypeGraphQL.Field(_type => ImageUploadInput, {
    nullable: false,
  })
  profilePicture!: ImageUploadInput;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  latitude!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  longitude!: string;
}