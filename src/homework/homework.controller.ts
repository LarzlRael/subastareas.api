import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { User } from '../auth/entities/User';
import { HomeworkDto } from './dto/Homework.dto';
import { GetUser } from '../auth/get-user..decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('homework')
@UseGuards(AuthGuard('jwt'))
export class HomeworkController {
  constructor(private homeworkService: HomeworkService) {}

  @Post('/create')
  postHomeWork(
    @Body() homeworkDto: HomeworkDto,
    @GetUser() user: User,
  ): Promise<void> {
    console.log(user.id);
    return this.homeworkService.createHomework(homeworkDto, user);
  }
}
