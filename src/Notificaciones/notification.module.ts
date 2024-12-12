import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationsController } from './notification.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Notification])],
    controllers: [NotificationsController],
    providers: [NotificationService],
    exports: [NotificationService], // Asegúrate de que está exportado
  })
  export class NotificationModule {}
