import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class ToggleSubscribeInput {
  @Field((type) => Int)
  podcastId: number;
}

@ObjectType()
export class ToggleSubscribeOutput extends CoreOutput {}
