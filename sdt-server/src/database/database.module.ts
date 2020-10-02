import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { SchemaModule } from '../schemas/schema.module';

@Module({
    providers: [...databaseProviders],
    exports: [...databaseProviders],
})
export class DatabaseModule {}
