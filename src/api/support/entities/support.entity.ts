import { SupportDetail } from '@/api/support-details/entities/support-detail.entity';

export class Support {
  uid: string;
  title: string;
  description: string;
  caseClosed: boolean;
  supportDetails: [SupportDetail];
}
