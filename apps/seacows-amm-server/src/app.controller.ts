import { Controller, Get, Param } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/healthz')
  healthz(): string {
    return "I'm alive!";
  }
  @Get('/ping')
  getPing(): string {
    return 'Pong!';
  }
}
