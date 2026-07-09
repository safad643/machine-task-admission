import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module.js';
import { StudentsModule } from './students/students.module.js';
import { AppConfigModule } from './config/config.module.js';
import { AppDatabaseModule } from './database/database.module.js';
import { AppThrottlerModule } from './throttler/throttler.module.js';
import { ExamSlotsModule } from './exam-slots/exam-slots.module.js';

@Module({
  imports: [
    AppConfigModule,
    AppDatabaseModule,
    AppThrottlerModule,
    AuthModule,
    StudentsModule,
    ExamSlotsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
