import { Controller, Get } from '@nestjs/common';
import { BookedEventService } from './bookedEvent.service';

@Controller('bookedevent')
export class BookedEventController {
  constructor(private readonly bookedEventService: BookedEventService) {}
  @Get('/test')
  test() {}
}
