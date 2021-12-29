import { InputType, PickType } from '@nestjs/graphql';
import { Podcast } from '../entites/podcast.entity';

@InputType()
export class CreatePodcastInput extends PickType(Podcast, [
  'title',
  'category',
]) {}
