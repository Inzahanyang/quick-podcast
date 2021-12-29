import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class DeletePodcastInput {
  @Field((type) => Int)
  podcastId: number;
}
