import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/role.decorator';
import { Podcast } from 'src/podcasts/entites/podcast.entity';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import {
  MarkEpisodeAsPlayedInput,
  MarkEpisodeAsPlayedOutput,
} from './dtos/mark-episode-played.dto';
import {
  ToggleSubscribeInput,
  ToggleSubscribeOutput,
} from './dtos/subscribe.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@UseGuards(AuthGuard)
@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation((retuns) => CreateAccountOutput)
  createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation((returns) => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Query((returns) => User)
  @Role(['Any'])
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Query((returns) => UserProfileOutput)
  @Role(['Any'])
  userProfile(
    @Args('input') userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return this.usersService.findById(userProfileInput.userId);
  }

  @Mutation((returns) => EditProfileOutput)
  @Role(['Any'])
  editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.usersService.editProfile(authUser.id, editProfileInput);
  }

  @Role(['Listener'])
  @Mutation((returns) => ToggleSubscribeOutput)
  toggleSubscribe(
    @AuthUser() user: User,
    @Args('input') toggleSubscribeInput: ToggleSubscribeInput,
  ): Promise<ToggleSubscribeOutput> {
    return this.usersService.toggleSubscribe(user, toggleSubscribeInput);
  }

  @Role(['Listener'])
  @Query((returns) => [Podcast])
  subscriptions(@AuthUser() user: User): Podcast[] {
    return user.subscriptions;
  }

  @Role(['Listener'])
  @Mutation((returns) => MarkEpisodeAsPlayedOutput)
  markEpisodeAsPlayed(
    @AuthUser() user: User,
    @Args('input') markEpisodeAsPlayedInput: MarkEpisodeAsPlayedInput,
  ): Promise<MarkEpisodeAsPlayedOutput> {
    return this.usersService.markEpisodeAsPlayed(
      user,
      markEpisodeAsPlayedInput,
    );
  }
}
