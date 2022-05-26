import { IsString } from 'class-validator';

export class ObjectDto {
  @IsString()
  path: string;

  @IsString()
  fullname: string;
}
