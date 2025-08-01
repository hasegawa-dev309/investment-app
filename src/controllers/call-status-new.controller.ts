import { Controller, Get, Put, Post, Param, Body } from '@nestjs/common';
import { CallStatusNewService } from '../services/call-status-new.service';
import { CreateCallStatusDto } from '../dto/create-call-status.dto';

@Controller('call-status-new')
export class CallStatusNewController {
  constructor(private readonly callStatusService: CallStatusNewService) {}

  @Get('date/:callDate')
  async getCurrentNumber(@Param('callDate') callDate: string) {
    return this.callStatusService.getCurrentNumber(callDate);
  }

  @Put('date/:callDate/number')
  async updateCurrentNumber(
    @Param('callDate') callDate: string,
    @Body() createCallStatusDto: CreateCallStatusDto,
  ) {
    return this.callStatusService.updateCurrentNumber(callDate, createCallStatusDto.current_number);
  }

  @Post('date/:callDate/advance')
  async advanceNumber(@Param('callDate') callDate: string) {
    return this.callStatusService.advanceNumber(callDate);
  }
} 