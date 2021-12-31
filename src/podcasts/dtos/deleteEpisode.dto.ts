import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeleteEpisodeInput {
  @Field((type) => Int)
  podcastId: number;
  @Field((type) => Int)
  episodeId: number;
}

@ObjectType()
export class DeleteEpisodeOutput extends CoreOutput {}
