import { Injectable } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UploadFileDto } from './dto/upload-photos.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';

@Injectable()
export class PhotoService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createPhotoDto: CreatePhotoDto) {
    return 'This action adds a new photo';
  }

  findAll() {
    return `This action returns all photo`;
  }

  findOne(id: string) {
    return this.prismaService.photo.findUnique({
      where: { id: id },
    });
  }

  remove(id: string) {
    return this.prismaService.photo.delete({
      where: {
        id: id,
      },
    });
  }

  createMany(eventId: string, uploadPhotosDto: UploadFileDto) {
    return;
  }

  async findPhotosInEvent(userId: string, eventId: string) {
    return await this.prismaService.photo.findMany({
      where: {
        userId: userId,
        eventId: eventId,
      },
    });
  }

  async deleteUserPhotosInEvent(userId: string, eventId: string) {
    return await this.prismaService.photo.deleteMany({
      where: {
        userId: userId,
        eventId: eventId,
      },
    });
  }

  async deleteAllPhotosInEvent(eventId: string) {
    return await this.prismaService.photo.deleteMany({
      where: {
        eventId: eventId,
      },
    });
  }

  async findUserPhotos(userId: string) {
    return await this.prismaService.photo.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async findUserEventPhotos(eventId: string, userId: string) {
    return await this.prismaService.photo.findMany({
      where: {
        userId: userId,
        eventId: eventId,
      },
    });
  }

  async findCreatorEventPhotos(eventId: string) {
    return await this.prismaService.photo.findMany({
      where: {
        eventId: eventId,
      },
    });
  }
}
