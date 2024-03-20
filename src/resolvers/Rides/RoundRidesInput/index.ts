import "reflect-metadata";
import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.InputType({})
export class RoundRidesInputCreate {

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  id_rides!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  startTime!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  endTime!: string;
}

@TypeGraphQL.InputType({})
export class RoundRidesInput {
  @TypeGraphQL.Field(() => [RoundRidesInputCreate], {
    nullable: false,
  })
  roundridesinputcreate!: [RoundRidesInputCreate];
}

@TypeGraphQL.InputType("RoundRidesInputUpdate", {})
export class RoundRidesInputUpdate {

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  id_roundrides!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  id_rides!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  startTime!: string;

  @TypeGraphQL.Field(() => String, {
    nullable: false,
  })
  endTime!: string;
}