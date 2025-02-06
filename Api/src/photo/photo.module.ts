import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { EventService } from 'src/event/event.service';
import { MulterService } from 'src/multer/multer.service';

@Module({
  controllers: [PhotoController],
  providers: [
    PhotoService,
    PrismaService,
    UserService,
    EventService,
    MulterService,
  ],
})
export class PhotoModule {}
