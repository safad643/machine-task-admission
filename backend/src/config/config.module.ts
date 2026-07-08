import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { envValidationSchema } from './env.validation.js';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: true,
        allowUnknown: false,
      },
    }),
  ],
})
export class AppConfigModule {}
