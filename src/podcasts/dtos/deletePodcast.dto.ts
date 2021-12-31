import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeletePodcastInput {
  @Field((type) => Int)
  podcastId: number;
}

@ObjectType()
export class DeletePodcastOutput extends CoreOutput {}
