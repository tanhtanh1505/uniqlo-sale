import { Controller, Delete, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CronService } from './cron.service';
import { Roles } from 'src/utils/roles/role.decorator';
import { Role } from 'src/utils/roles/role.enum';

@ApiBearerAuth()
@Roles(Role.Admin)
@ApiTags('cron')
@Controller('cron')
export class CronController {
  constructor(private cronService: CronService) {}

  @ApiOperation({ summary: 'Restart Cron' })
  @ApiResponse({ status: 200 })
  @Get('restart')
  async restartCron(): Promise<string> {
    this.cronService.restartCron();
    return 'Restarted';
  }

  @ApiOperation({ summary: 'Delete Cron' })
  @ApiResponse({ status: 200 })
  @Delete('delete')
  async deleteCron(): Promise<string> {
    this.cronService.deleteCron();
    return 'Deleted';
  }

  @ApiOperation({ summary: 'Test job' })
  @ApiResponse({ status: 200 })
  @Get('test')
  async testJob(): Promise<string> {
    await this.cronService.testJob();
    return 'Tested';
  }
}
