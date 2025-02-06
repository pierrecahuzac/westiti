import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService)
    private userService: UserService,
    @Inject(JwtService)
    private jwtService: JwtService,
  ) {}

  async signUp(registerDto: RegisterDto) {
    if (
      !registerDto.email.match(/^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/i)
    ) {
      throw new UnauthorizedException({ message: 'Email invalide' });
    }

    const user = await this.userService.findByEmail(registerDto.email);
    if (user) {
      throw new UnauthorizedException({ message: 'Email existant' });
    }

    if (registerDto.password !== registerDto.password_confirmation) {
      throw new UnauthorizedException({
        message:
          'Mot de passe et mot de passe confirmation ne correspondent pas',
      });
    }
    if (
      !registerDto.password ||
      !registerDto.password_confirmation ||
      !registerDto.email ||
      !registerDto.name
    ) {
      throw new UnauthorizedException({
        message: 'Il manque des données pour pouvoir créer votre compte',
      });
    }
    if (
      registerDto.password.match(/[a-z]/g) === null ||
      registerDto.password.match(/[A-Z]/g) === null ||
      registerDto.password.match(/[0-9]/g) === null ||
      registerDto.password.match(/[^a-zA-Z\d]/g) === null
    ) {
      throw new UnauthorizedException({ message: 'Mot de passe faible' });
    }

    if (registerDto.password.length < 12) {
      throw new UnauthorizedException({ message: 'Mot de passe trop court' });
    }

    const userDto: CreateUserDto = {
      email: registerDto.email,
      password: registerDto.password,
      name: registerDto.name,
    };

    
    return this.userService.create(userDto);
  }

  async signIn(email: string, password: string, res: Response) {
    const user = await this.userService.findByEmail(email);  
    const isMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (!user || !isMatch) {
      throw new UnauthorizedException({
        message: 'Email et/ou mot de passe incorrect',
      });
    }
    
    const payload = { id: user.id, email: user.email };
    
    const token = await this.jwtService.signAsync(payload);

    res.cookie('access_token', token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure:true, 
      sameSite: "none",
    });
    
    
    return {
      message: 'Connexion réussie',
      user: { id: user.id, username: user.name },
    };
  }
}
