import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module.js';
import { AppConfigModule } from './config/config.module.js';
import { AppDatabaseModule } from './database/database.module.js';
import { AppThrottlerModule } from './throttler/throttler.module.js';

@Module({
  imports: [AppConfigModule, AppDatabaseModule, AppThrottlerModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
