import "reflect-metadata";
import * as TypeGraphQL from "type-graphql";
import { ImageUploadInput } from "src/features/uploadFile/ImageUploadInput";

@TypeGraphQL.InputType("PromotionCreateInput", {})
export class PromotionInputCreate {

  @TypeGraphQL.Field(() => String)
  id_ticket?: string;

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

  @TypeGraphQL.Field(() => Number, {
    nullable: false,
  })
  discountchild!: number;

  @TypeGraphQL.Field(() => Number, {
    nullable: false,
  })
  discountadult!: number;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
  })
  startDate?: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
  })
  endDate?: string | null;

  @TypeGraphQL.Field(_type => ImageUploadInput, {
    nullable: false,
  })
  profilePicture!: ImageUploadInput;
}

@TypeGraphQL.InputType("PromotionInputUpdate", {})
export class PromotionInputUpdate {

  @TypeGraphQL.Field(() => String)
  id_promotion?: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  title!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  description!: string;

  @TypeGraphQL.Field(() => Number, {
    nullable: false,
  })
  discountchild!: number;

  @TypeGraphQL.Field(() => Number, {
    nullable: false,
  })
  discountadult!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
  })
  startDate?: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
  })
  endDate?: Date | null;

  @TypeGraphQL.Field(_type => ImageUploadInput, {
    nullable: false,
  })
  profilePicture!: ImageUploadInput;
}