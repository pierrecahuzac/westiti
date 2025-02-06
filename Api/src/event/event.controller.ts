import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
  UseInterceptors,
  UploadedFiles,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JoinEventDto } from './dto/joint-event.dto';
import { LeaveEventDto } from './dto/leave-event.dto';
import { UserEventService } from 'src/userevent/userevent.service';
import { UserService } from 'src/user/user.service';
import { MulterService } from 'src/multer/multer.service';
import { PhotoService } from 'src/photo/photo.service';
import { DeleteEventDto } from './dto/delete-event.dto';
import { UploadFileAuthorization } from 'src/authorizations/upload-files.auth';

@Controller('/api/event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
    private readonly userEventService: UserEventService,
    private readonly prismaService: PrismaService,
    private readonly multerService: MulterService,
    private readonly photoService: PhotoService,
  ) {}
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  public async findAll(@Query() query: { userId: string }) {
    const userId = query.userId;

    if (userId === undefined) {
      throw new UnauthorizedException({
        message: 'Vous ne pouvez pas effectuer cette opération.',
      });
    }
    return this.userEventService.findUserEvents(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  async removeEventByCreator(
    @Param('id') eventId: string,
    @Body() deleteEventDto: DeleteEventDto,
  ) {

    const user = await this.userService.findOne(deleteEventDto.userId);
    const event = await this.eventService.findOne(eventId);
    
    if (event.creator_id.id !== user.id) {
      throw new UnauthorizedException({
        message: "Vous n'avez pas les droits pour supprimer cet événement",
      });
    }

    const photosEvent = await this.photoService.findCreatorEventPhotos(eventId);

    if (photosEvent.length !== 0) {
      this.multerService.deleteFiles(photosEvent);
    }

    await this.photoService.deleteAllPhotosInEvent(eventId);

    return this.eventService.remove(eventId);
  }

  @Post(':id/user/:userId/upload')
  @UseGuards(UploadFileAuthorization)
  @UseInterceptors(FilesInterceptor('file'))
  public async uploadPhotos(
    @UploadedFiles() file,
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    const user = await this.userService.findUserWithParticipations(userId);

    const isEventParticipant = user?.participations.some(
      (event) => event.eventId === id,
    );

    if (!isEventParticipant) {
      throw new UnauthorizedException({
        message: "Vous ne pouvez pas uploader d'image sur cet événement",
      });
    }

    if (!file) {
      throw new UnauthorizedException({
        message: "Aucune photo n'a été envoyée",
      });
    }
    return this.eventService.uploadPhotos(id, userId, file);
  }

  @Post('/join')
  public async joinEvent(@Body() joinEventDto: JoinEventDto) {
    const event = await this.prismaService.event.findFirst({
      where: {
        access_code: joinEventDto.access_code,
      },
    });

    if (!event) {
      throw new UnauthorizedException({
        message: "Cet événememt n'existe pas",
      });
    }

    const userIsEventParticipant = await this.prismaService.userevent.findFirst({
      where: {
        userId: joinEventDto.userId
      }
    })

    if(userIsEventParticipant){
      throw new UnauthorizedException({
        message: "Vous êtes déjà inscrit à cet évènement"
      })
    }

    const eventId = event.id;
    await this.userEventService.jointEvent(joinEventDto, eventId);

    return this.userEventService.findUserEvents(joinEventDto.userId);
  }

  @Post('/leave')
  public async leaveEvent(@Body() leaveEventDto: LeaveEventDto) {


    
    const user = await this.userService.findUserWithParticipations(
      leaveEventDto.userId,
    );

    let eventInDb = null;
    user.participations.map((event) => {
      if (event.eventId === leaveEventDto.eventId) {
        return (eventInDb = event);
      }
    });

    const eventToLeave = eventInDb.id;

    const event = await this.eventService.findOne(eventInDb.eventId);

    const userPhotosEvent = await this.photoService.findPhotosInEvent(
      user.id,
      event.id,
    );

    this.multerService.deleteFiles(userPhotosEvent);

    await this.photoService.deleteUserPhotosInEvent(user.id, event.id);

    return this.userEventService.leaveEvent(eventToLeave);
  }

  @Get(':id/user/:userId')
  public async findUserEventPhotos(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    const event = await this.eventService.findOne(id);
    const user = await this.userService.findOne(userId);

    if (event.creator_id.id && (event.creator_id.id === user.id)) {
      return this.photoService.findCreatorEventPhotos(id);
    }

    return this.photoService.findUserEventPhotos(id, userId);
  }
}
