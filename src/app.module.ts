import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USERNAME, // your username
      password: process.env.DB_PASSWORD, // your password
      database: process.env.DB_DATABASE, // name of database
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
