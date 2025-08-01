import { Controller, Get, Put, Post, Param, Body } from '@nestjs/common';
import { SystemStatusNewService } from '../services/system-status-new.service';
import { CreateSystemStatusDto } from '../dto/create-system-status.dto';

@Controller('system-status-new')
export class SystemStatusNewController {
  constructor(private readonly systemStatusService: SystemStatusNewService) {}

  @Get('date/:statusDate')
  async getSystemStatus(@Param('statusDate') statusDate: string) {
    return this.systemStatusService.getSystemStatus(statusDate);
  }

  @Put('date/:statusDate')
  async updateSystemStatus(
    @Param('statusDate') statusDate: string,
    @Body() createSystemStatusDto: CreateSystemStatusDto,
  ) {
    return this.systemStatusService.updateSystemStatus(
      statusDate, 
      createSystemStatusDto.is_under_maintenance, 
      createSystemStatusDto.message
    );
  }

  @Post('date/:statusDate/maintenance')
  async setMaintenanceMode(
    @Param('statusDate') statusDate: string,
    @Body() body: { message?: string },
  ) {
    return this.systemStatusService.setMaintenanceMode(statusDate, body.message);
  }

  @Post('date/:statusDate/clear-maintenance')
  async clearMaintenanceMode(@Param('statusDate') statusDate: string) {
    return this.systemStatusService.clearMaintenanceMode(statusDate);
  }

  @Get('date/:statusDate/maintenance-check')
  async isUnderMaintenance(@Param('statusDate') statusDate: string) {
    const isUnderMaintenance = await this.systemStatusService.isUnderMaintenance(statusDate);
    return { is_under_maintenance: isUnderMaintenance };
  }
} 