import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Podcast } from '../entites/podcast.entity';

@InputType()
export class SearchPodcastInput {
  @Field((type) => String)
  query: string;
}

@ObjectType()
export class SearchPodcastOutput extends CoreOutput {
  @Field((type) => [Podcast], { nullable: true })
  podcasts?: Podcast[];
}
