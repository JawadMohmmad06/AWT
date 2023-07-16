import { Controller, Get } from "@nestjs/common";
import { SurveysService } from "./surveys.service";

@Controller('surveys')
export class SurveysController{
    constructor(private readonly surveysService:SurveysService){}
    @Get('/test')
    ge(){
        
    }
}