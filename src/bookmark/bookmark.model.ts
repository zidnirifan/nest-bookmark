import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBookmarkBody {
  @IsNotEmpty()
  url: string;

  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;
}

export class EditBookmarkBody {
  @IsOptional()
  url?: string;

  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;
}
