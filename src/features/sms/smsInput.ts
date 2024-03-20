import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.InputType()
export class smsVerifyInput {
  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  email!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  phone!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  otp!: string;

  @TypeGraphQL.Field(() => Boolean, {
    nullable: false,
  })
  isResend!: boolean;

  @TypeGraphQL.Field(() => Boolean, {
    nullable: false,
  })
  isVerify!: boolean;
}
