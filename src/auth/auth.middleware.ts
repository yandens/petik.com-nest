import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    const token = req.headers.authorization?.split(' ');
    if (token) {
      if (token[0] !== 'Bearer') throw new HttpException('Invalid token', 401);

      const decoded = this.jwtService.verify(token[1]);
      const user = await this.prismaService.user.findUnique({
        where: { id: decoded.id },
      });
      if (user) req.user = user;
    }

    next();
  }
}
