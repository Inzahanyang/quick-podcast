import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { CreatePodcastInput } from './createPodcast.dto';

@InputType()
export class UpdatePodcastInput extends PartialType(CreatePodcastInput) {
  @Field((type) => Int)
  podcastId: number;
}

@ObjectType()
export class UpdatePodcastOutput extends CoreOutput {}
