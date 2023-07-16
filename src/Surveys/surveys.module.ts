import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendeeEntity } from 'src/Attendee/attendee.entity';
import { SurveysController } from './surveys.controller';
import { SurveyEnity } from './surveys.entity';
import { SurveysService } from './surveys.service';

@Module({
  imports: [TypeOrmModule.forFeature([AttendeeEntity, SurveyEnity])],
  controllers: [SurveysController],
  providers: [SurveysService],
})
export class SurveysModule {}
