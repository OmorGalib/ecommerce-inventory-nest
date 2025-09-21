import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'API Health Check' })
  @ApiResponse({ status: 200, description: 'API is running' })
  getHello(): { message: string; timestamp: string; status: string } {
    return {
      message: 'E-commerce Inventory API is running',
      timestamp: new Date().toISOString(),
      status: 'OK'
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  healthCheck(): { status: string } {
    return { status: 'OK' };
  }
}