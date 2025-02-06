import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UserEventService } from 'src/userevent/userevent.service';
import { UserService } from 'src/user/user.service';
import { MulterService } from 'src/multer/multer.service';
import { PhotoService } from 'src/photo/photo.service';
import { UploadFileAuthorization } from 'src/authorizations/upload-files.auth';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = './public/uploads/photos';
          if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
          }
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const extension = extname(file.originalname);
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `img-${randomName}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/jpg|jpeg|png|webp$/)) {
          cb(null, true);
        } else cb(new Error('Format non supporté'), false);
      },
      limits: {
        fileSize: 5000000
      }
    }),
  ],
  controllers: [EventController],
  providers: [
    EventService,
    UserEventService,
    UserService,
    MulterService,
    PhotoService,
    UploadFileAuthorization,
  ],
  exports: [EventService],
})
export class EventModule {}
