import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UnauthorizedException,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { DeletePhotoDto } from './dto/delete-photo.dto';
import { UserService } from 'src/user/user.service';
import { EventService } from 'src/event/event.service';
import { MulterService } from 'src/multer/multer.service';

@Controller('/api/photo')
export class PhotoController {
  constructor(
    private readonly photoService: PhotoService,
    private readonly userService: UserService,
    private readonly eventService: EventService,
    private readonly multerService: MulterService,
  ) {}

  @Post()
  create(@Body() createPhotoDto: CreatePhotoDto) {
    return this.photoService.create(createPhotoDto);
  }

  @Get()
  findAll() {
    return this.photoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.photoService.findOne(id);
  }

  @Delete(':id')
  public async remove(
    @Param('id') photoId: string,
    @Body() deletePhotoDto: DeletePhotoDto,
  ) {
    const user = await this.userService.findOne(deletePhotoDto.userId);
    const event = await this.eventService.findOne(deletePhotoDto.eventId);
    const photo = await this.photoService.findOne(photoId);

    if (!(event.creator_id.id === user.id || photo.userId === user.id)) {
      throw new UnauthorizedException({
        message: "Vous n'avez pas les droits pour supprimer cette photo",
      });
    }

    const files = [];
    files.push(photo);

    this.multerService.deleteFiles(files);

    return this.photoService.remove(photoId);
  }
}
