import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto'; // Case-sensitive!

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: SignupDto) {
    // Hash the password before saving
    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
      },
    });

    return { message: 'User created successfully', userId: user.id };
  }
}
