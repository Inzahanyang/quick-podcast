import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Podcast } from './podcast.entity';

@InputType('ReviewInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Review extends CoreEntity {
  @Field((type) => String)
  @Column()
  review: string;

  @Field((type) => Podcast)
  @ManyToOne((type) => Podcast, (podcast) => podcast.reviews)
  podcast: Podcast;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.reviews)
  user: User;
}
