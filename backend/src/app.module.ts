import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module.js';
import { AppDatabaseModule } from './database/database.module.js';
import { AppThrottlerModule } from './throttler/throttler.module.js';

@Module({
  imports: [AppConfigModule, AppDatabaseModule, AppThrottlerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
