import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CodeController } from './api/rest/code/code.controller';
import { CodeModule } from './api/rest/code/code.module';

@Module({
  imports: [CodeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
