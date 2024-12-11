import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async create(@Body() createNotificationDto: { title: string; message: string }) {
    return this.notificationService.createNotification(
      createNotificationDto.title,
      createNotificationDto.message,
    );
  }

  @Get()
  async findAll() {
    return this.notificationService.getAllNotifications();
  }

  @Patch(':id')
  async markAsRead(@Param('id') id: number) {
    return this.notificationService.markAsRead(id);
  }
}
