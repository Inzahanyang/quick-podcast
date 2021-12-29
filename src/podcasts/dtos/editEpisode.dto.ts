import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { Episode } from '../entites/episode.entity';

@InputType()
export class EditEpisodeInput extends PartialType(Episode) {
  @Field((type) => Int)
  podcastId: number;

  @Field((type) => Int)
  episodeId: number;
}
