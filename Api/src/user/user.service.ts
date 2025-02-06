import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    if (
      !createUserDto.email.match(/^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/i)
    ) {
      throw new UnauthorizedException({ message: 'Email invalide' });
    }

    if (
      createUserDto.password.match(/[a-z]/g) === null ||
      createUserDto.password.match(/[A-Z]/g) === null ||
      createUserDto.password.match(/[0-9]/g) === null ||
      createUserDto.password.match(/[^a-zA-Z\d]/g) === null
    ) {
      throw new UnauthorizedException({ message: 'Mot de passe faible' });
    }

    if (createUserDto.password.length < 12) {
      throw new UnauthorizedException({ message: 'Mot de passe trop court' });
    }
    const data = await this.prismaService.user.upsert({
      where: {
        email: createUserDto.email,
      },
      update: {},
      create: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        avatar: 'test',
      },
    });
  
    const result = {
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      id: data.id,
    };
    return result;
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    if (
      updateUserDto.password.match(/[a-z]/g) === null ||
      updateUserDto.password.match(/[A-Z]/g) === null ||
      updateUserDto.password.match(/[0-9]/g) === null ||
      updateUserDto.password.match(/[^a-zA-Z\d]/g) === null
    ) {
      throw new UnauthorizedException({ message: 'Mot de passe faible' });
    }

    if (updateUserDto.password.length < 12) {
      throw new UnauthorizedException({ message: 'Mot de passe trop court' });
    }

    if (
      !updateUserDto.email.match(/^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/i)
    ) {
      throw new UnauthorizedException({ message: 'Email invalide' });
    }

    const user = await this.findOne(id);
    let hashedPassword = user.password;
    if (updateUserDto.password !== undefined) {
      hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    }

    const data = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
        password: hashedPassword,
      },
    });
    const result = {
      name: data.name,
      email: data.email,
      avatar: data.avatar,
    };
    return result;
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  remove(id: string) {
    this.prismaService.photo.deleteMany({
      where: { userId: id },
    });

    return this.prismaService.user.delete({
      where: { id },
    });
  }

  async findUserWithParticipations(userId: string) {
    return await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        participations: true,
      },
    });
  }
}
