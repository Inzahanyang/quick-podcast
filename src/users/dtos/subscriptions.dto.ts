import { Field } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Podcast } from 'src/podcasts/entites/podcast.entity';

export class SubscriptionsOutput extends CoreOutput {
  @Field((type) => [Podcast], { nullable: true })
  subscriptions?: Podcast[];
}
