import { IsString, IsBoolean } from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  title: string;

  @IsBoolean()
  completed: boolean;
}
