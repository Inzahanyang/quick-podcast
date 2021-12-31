import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Episode } from '../entites/episode.entity';

@InputType()
export class CreateEpisodeInput extends PickType(Episode, ['title']) {
  @Field((type) => Int)
  podcastId: number;
}

@ObjectType()
export class CreateEpisodeOutput extends CoreOutput {
  @Field((type) => Int, { nullable: true })
  id?: number;
}
