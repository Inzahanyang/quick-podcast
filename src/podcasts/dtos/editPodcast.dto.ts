import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreatePodcastInput } from './createPodcast.dto';

@InputType()
export class EditPodcastInput extends PartialType(CreatePodcastInput) {
  @Field((type) => Int)
  podcastId: number;
}
