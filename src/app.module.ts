import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configs from './app/config';
import { ConfigModule } from '@nestjs/config';
import { SupportModule } from './api/support/support.module';
import { SupportsModule } from './microservice/supports/supports.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
