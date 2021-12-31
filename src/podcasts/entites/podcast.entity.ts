import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Episode } from './episode.entity';

@InputType('PodcastInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Podcast extends CoreEntity {
  @Field((type) => String)
  @Column()
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
}
