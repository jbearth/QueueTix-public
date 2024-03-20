import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.InputType()
export class ImageUploadInput {
  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  filename!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  mimeType!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  data!: string; // base64 encoded image data
}
