import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemStatusNew } from '../entities/system-status-new.entity';
import { CreateSystemStatusDto } from '../dto/create-system-status.dto';

@Injectable()
export class SystemStatusNewService {
  constructor(
    @InjectRepository(SystemStatusNew)
    private systemStatusRepository: Repository<SystemStatusNew>,
  ) {}

  async getSystemStatus(statusDate: string): Promise<SystemStatusNew | null> {
    return this.systemStatusRepository.findOne({
      where: { status_date: new Date(statusDate) }
    });
  }

  async updateSystemStatus(statusDate: string, isUnderMaintenance: boolean, message?: string): Promise<SystemStatusNew> {
    let systemStatus = await this.systemStatusRepository.findOne({
      where: { status_date: new Date(statusDate) }
    });

    if (!systemStatus) {
      // 新しい日付の場合は新規作成
      systemStatus = this.systemStatusRepository.create({
        is_under_maintenance: isUnderMaintenance,
        message: message || '',
        status_date: new Date(statusDate)
      });
    } else {
      // 既存の場合は更新
      systemStatus.is_under_maintenance = isUnderMaintenance;
      systemStatus.message = message || '';
    }

    return this.systemStatusRepository.save(systemStatus);
  }

  async setMaintenanceMode(statusDate: string, message?: string): Promise<SystemStatusNew> {
    return this.updateSystemStatus(statusDate, true, message);
  }

  async clearMaintenanceMode(statusDate: string): Promise<SystemStatusNew> {
    return this.updateSystemStatus(statusDate, false, '');
  }

  async isUnderMaintenance(statusDate: string): Promise<boolean> {
    const systemStatus = await this.getSystemStatus(statusDate);
    return systemStatus?.is_under_maintenance || false;
  }
} 