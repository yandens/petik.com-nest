import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UtilsModule } from './utils/utils.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [CommonModule, AuthModule, UtilsModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
