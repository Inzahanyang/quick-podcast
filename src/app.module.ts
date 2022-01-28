import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from './podcasts/entites/episode.entity';
import { Podcast } from './podcasts/entites/podcast.entity';
import { PodcastsModule } from './podcasts/podcasts.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { Review } from './podcasts/entites/review.entity';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        PRIVATE_KEY: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: (connection: any) => ({ token: connection['x-jwt'] }),
        },
      },
      context: ({ req }) => ({ token: req.headers['x-jwt'] }),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.NODE_ENV === 'dev' ? 'db.sqlite' : 'db.sqlitetest',
      logging: false,
      synchronize: true,
      entities: [Podcast, Episode, User, Review],
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY || 'e@4$qjM"9)5`h190?^"#',
    }),
    AuthModule,
    PodcastsModule,
    UsersModule,
    CommonModule,
  ],
})
export class AppModule {}
