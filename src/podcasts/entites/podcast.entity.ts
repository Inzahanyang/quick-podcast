import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Episode } from './episode.entity';

@InputType('PodcastInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Podcast extends CoreEntity {
  @Field((type) => String)
  @Column({ unique: true })
  title: string;

  @Field((type) => String)
  @Column()
  category: string;

  @Field((type) => String)
  @Column()
  rating: number;

  @Field((type) => [Episode])
  @OneToMany((type) => Episode, (episode) => episode.podcast)
  episodes: Episode[];

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.podcasts, { onDelete: 'CASCADE' })
  user: User;
}
