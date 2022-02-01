import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Episode } from 'src/podcasts/entites/episode.entity';

@InputType()
export class MarkEpisodeAsPlayedInput extends PickType(
  Episode,
  ['id'],
  InputType,
) {}

@ObjectType()
export class MarkEpisodeAsPlayedOutput extends CoreOutput {}
