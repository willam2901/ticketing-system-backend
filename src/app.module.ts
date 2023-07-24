import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configs from './app/config';
import { ConfigModule } from '@nestjs/config';
import { SupportModule } from './api/support/support.module';
import { SupportsModule } from './microservice/supports/supports.module';
import { TwilioWebhookModule } from './api/twilio-webhook/twilio-webhook.module';
import { SupportDetailsModule } from './api/support-details/support-details.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      load: configs,
      envFilePath: ['.env'],
    }),
    SupportModule,
    SupportsModule,
    TwilioWebhookModule,
    SupportDetailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
