import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Podcast } from '../entites/podcast.entity';

@InputType()
export class PodcastInput {
  @Field((type) => Int)
  podcastId: number;
}

@ObjectType()
export class PodcastOutput extends CoreOutput {
  @Field((type) => Podcast, { nullable: true })
  podcast?: Podcast;
}
