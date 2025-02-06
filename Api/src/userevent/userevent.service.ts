import { Injectable } from '@nestjs/common';
import { JoinEventDto } from 'src/event/dto/joint-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserEventService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserEvents(userId: string) {

    
    return await this.prismaService.userevent.findMany({
      where: {
        userId: userId,
      },
      include: {
        event_id: true,
      },
    });
  }

  async jointEvent(joinEventDto: JoinEventDto, eventId: string) {
    return await this.prismaService.userevent.create({
      data: {
        user_id: {
          connect: {
            id: joinEventDto.userId,
          },
        },
        event_id: {
          connect: {
            id: eventId,
          },
        },
      },
    });
  }

  async leaveEvent(eventToLeave: number) {
    return await this.prismaService.userevent.delete({
      where: {
        id: eventToLeave,
      },
    });
  }
}
