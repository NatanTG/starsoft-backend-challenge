import { IsString, IsDateString } from 'class-validator';

export class UserCreatedEventDto {
  @IsString()
  id: string;

  @IsString()
  email: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}

export namespace UserEvents {
  export type UserCreated = UserCreatedEventDto;
}
