import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Review } from '../entites/review.entity';

@InputType()
export class ReviewPodcastInput extends PickType(Review, ['review']) {
  @Field((type) => Int)
  podcastId: number;
}

@ObjectType()
export class ReviewPodcastOutput extends CoreOutput {
  @Field((type) => Review, { nullable: true })
  review?: Review;
}
