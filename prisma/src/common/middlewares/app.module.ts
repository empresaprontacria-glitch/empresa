import { Module } from '@nestjs/common';
import { AiController } from './modules/ai/ai.controller';
import { AiService } from './modules/ai/ai.service';
import { SalonController } from './modules/salon/salon.controller';
import { SalonService } from './modules/salon/salon.service';
import { SuperAdminController } from './modules/super-admin/super-admin.controller';
import { SuperAdminService } from './modules/super-admin/super-admin.service';
import { WhatsappController } from './modules/whatsapp/whatsapp.controller';
import { WhatsappService } from './modules/whatsapp/whatsapp.service';
import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [
    AiController,
    SalonController,
    SuperAdminController,
    WhatsappController,
    AppController,
  ],
  providers: [
    AiService,
    SalonService,
    SuperAdminService,
    WhatsappService,
  ],
})
export class AppModule {}