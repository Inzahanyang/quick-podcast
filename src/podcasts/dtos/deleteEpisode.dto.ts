import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class DeleteEpisodeInput {
  @Field((type) => Int)
  podcastId: number;
  @Field((type) => Int)
  episodeId: number;
}
