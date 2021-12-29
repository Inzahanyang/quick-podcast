import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Episode } from './episode.entity';

@InputType('PodcastInputType', { isAbstract: true })
@ObjectType()
export class Podcast {
  @Field((type) => Int)
  id: number;

  @Field((type) => String)
  title: string;

  @Field((type) => String)
  category: string;

  @Field((type) => String)
  rating: number;

  @Field((type) => [Episode])
  episode: Episode[];
}
