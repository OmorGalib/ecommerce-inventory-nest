import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'API is running' })
  getHello(): { message: string; status: string } {
    return {
      message: 'E-commerce Inventory API is running',
      status: 'OK',
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'API is running' })
  healthCheck(): { message: string; status: string; timestamp: string } {
    return {
      message: 'E-commerce Inventory API is running',
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}