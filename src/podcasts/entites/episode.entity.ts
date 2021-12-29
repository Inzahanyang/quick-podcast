import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType('EpisodeInputType', { isAbstract: true })
@ObjectType()
export class Episode {
  @Field((type) => Int)
  id: number;

  @Field((type) => String)
  title: string;
}
