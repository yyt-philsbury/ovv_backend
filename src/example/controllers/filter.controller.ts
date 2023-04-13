import { Controller, ForbiddenException, Get } from '@nestjs/common';

@Controller('v1/example')
export class ExampleFilterController {
  @Get('throw1')
  throw1() {
    // All HTTPExceptions can take string or object for first argument
    // If string, then the response body is {status: 403, message: 'first arg', error: 'second arg'}
    throw new ForbiddenException(
      'String description of error',
      'Error description',
    );
  }

  @Get('throw2')
  throw2() {
    // If object, then the json body is overwritten with the object
    throw new ForbiddenException({ test: 'asfasf' });
  }

  @Get('throw3')
  throw3() {
    // Should be caught by uncaught.filter.ts
    throw new Error('random error');
  }

  @Get('throw4')
  throw4() {
    // Should be caught by uncaught.filter.ts
    throw 124;
  }
}

