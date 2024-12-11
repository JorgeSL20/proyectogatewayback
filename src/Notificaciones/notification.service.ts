import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(title: string, message: string): Promise<Notification> {
    const notification = this.notificationRepository.create({ title, message });
    return this.notificationRepository.save(notification);
  }

  async getAllNotifications(): Promise<Notification[]> {
    return this.notificationRepository.find();
  }

  async markAsRead(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOneBy({ id });
    if (!notification) throw new Error('Notification not found');
    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }
}
