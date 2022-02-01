import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Podcast } from 'src/podcasts/entites/podcast.entity';
import { Review } from 'src/podcasts/entites/review.entity';
import { Episode } from 'src/podcasts/entites/episode.entity';

export enum UserRole {
  Host = 'Host',
  Listener = 'Listener',
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field((type) => String)
  @Column({ unique: true })
  email: string;

  @Field((type) => String)
  @Column({ select: false })
  password: string;

  @Field((type) => UserRole)
  @Column({ type: 'simple-enum', enum: UserRole })
  role: UserRole;

  @Field((type) => [Podcast])
  @OneToMany((type) => Podcast, (podcast) => podcast.user, { eager: true })
  podcasts: Podcast[];

  @Field((type) => [Review])
  @OneToMany((type) => Review, (review) => review.user, { eager: true })
  reviews: Review[];

  @Field((type) => [Podcast])
  @ManyToMany(() => Podcast, { eager: true })
  @JoinTable()
  subscriptions: Podcast[];

  @Field((type) => [Episode])
  @ManyToMany(() => Episode, { eager: true })
  @JoinTable()
  playedEpisodes: Episode[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
