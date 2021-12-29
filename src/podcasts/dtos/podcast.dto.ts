import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Podcast } from '../entites/podcast.entity';

@InputType()
export class PodcastInput {
  @Field((type) => Int)
  podcastId: number;
}

@ObjectType()
export class PodcastOutput {
  @Field((type) => Podcast)
  results?: Podcast;
}
