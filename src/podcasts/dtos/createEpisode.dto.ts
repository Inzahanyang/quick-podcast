import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { Episode } from '../entites/episode.entity';

@InputType()
export class CreateEpisodeInput extends PickType(Episode, ['title']) {
  @Field((type) => Int)
  podcastId: number;
}
