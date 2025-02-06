import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UploadFileAuthorization implements CanActivate {
  public constructor(private readonly userService: UserService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userFromRequest = request.user;
    const eventId = request.params.id;

    const user = await this.userService.findUserWithParticipations(
      userFromRequest.id,
    );

    const isEventParticipant = user?.participations.some(
      (event) => event.eventId === eventId,
    );

    if (!isEventParticipant) {
      throw new UnauthorizedException({
        message: "Vous ne pouvez pas uploader d'image sur cet événement",
      });
    }

    return true;
  }
}
