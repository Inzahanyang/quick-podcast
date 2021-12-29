import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Episode } from '../entites/episode.entity';

@InputType()
export class EpisodesInput {
  @Field((type) => Int)
  podcastId: number;
}

@ObjectType()
export class EpisodesOutput {
  @Field((type) => [Episode])
  episodes: Episode[];
}
