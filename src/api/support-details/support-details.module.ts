import { Module } from '@nestjs/common';
import { SupportDetailsService } from './support-details.service';
import { SupportDetailsController } from './support-details.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [SupportDetailsController],
  providers: [SupportDetailsService, PrismaService],
})
export class SupportDetailsModule {}
