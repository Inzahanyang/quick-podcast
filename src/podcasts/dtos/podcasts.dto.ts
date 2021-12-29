import { Field, ObjectType } from '@nestjs/graphql';
import { Podcast } from '../entites/podcast.entity';

@ObjectType()
export class PodcastsOutput {
  @Field((type) => [Podcast], { nullable: true })
  podcasts?: Podcast[];
}
