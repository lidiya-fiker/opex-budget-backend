import { Module } from '@nestjs/common';
import { MockGlService } from './mock-gl.service';

@Module({
  providers: [MockGlService],
  exports: [MockGlService],
})
export class MockGlModule {}
