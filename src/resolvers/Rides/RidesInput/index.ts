import "reflect-metadata";
import * as TypeGraphQL from "type-graphql";
import { ImageUploadInput } from "src/features/uploadFile/ImageUploadInput";

@TypeGraphQL.InputType("RidesInputCreate", {})
export class RidesInputCreate {

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  id_amusementpark!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  nameThai!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  nameEng!: string;

  @TypeGraphQL.Field(() => Number, {
    nullable: false,
  })
  maxseats!: number;

  @TypeGraphQL.Field(() => Number, {
    nullable: false,
  })
  isSpecial!: number;

  @TypeGraphQL.Field(() => Number, {
    nullable: false,
  })
  usedFastpassAvailable!: number;

  @TypeGraphQL.Field(_type => ImageUploadInput, {
    nullable: false,
  })
  profilePicture!: ImageUploadInput;
}

@TypeGraphQL.InputType("RidesInputUpdate", {})
export class RidesInputUpdate {

  @TypeGraphQL.Field(() => String)
  id_rides?: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  id_amusementpark!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  nameThai!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  nameEng!: string;

  @TypeGraphQL.Field(() => Number, {
    nullable: false,
  })
  maxseats!: number;

  @TypeGraphQL.Field(() => Number, {
    nullable: false,
  })
  isSpecial!: number;

  @TypeGraphQL.Field(() => Number, {
    nullable: false,
  })
  usedFastpassAvailable!: number;

  @TypeGraphQL.Field(_type => ImageUploadInput, {
    nullable: false,
  })
  profilePicture!: ImageUploadInput;
}