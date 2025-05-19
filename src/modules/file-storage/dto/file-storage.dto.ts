import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class ImportActivityMemberDto {
  @IsString()
  @IsNotEmpty()
  readonly member_id: string;
}
