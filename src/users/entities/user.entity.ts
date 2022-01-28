import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Podcast } from 'src/podcasts/entites/podcast.entity';
import { Review } from 'src/podcasts/entites/review.entity';

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
  @OneToMany((type) => Podcast, (podcast) => podcast.user)
  podcasts: Podcast[];

  @Field((type) => [Review])
  @OneToMany((type) => Review, (review) => review.user)
  reviews: Review[];

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
