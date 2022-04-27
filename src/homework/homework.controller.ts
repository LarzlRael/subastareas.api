import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { User } from '../auth/entities/User';
import { HomeworkDto } from './dto/Homework.dto';
import { GetUser } from '../auth/get-user..decorator';
import { AuthGuard } from '@nestjs/passport';
import { Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/utils/utils';

@Controller('homework')
@UseGuards(AuthGuard('jwt'))
export class HomeworkController {
  constructor(private homeworkService: HomeworkService) { }

  @Get('/homeworks')
  getHomeWorks(@GetUser() user: User): Promise<HomeworkDto[]> {
    return this.homeworkService.getHomeworkByUser(user);
  }
  @Get('/:id')
  getOneHomeWork(@Param('id') id: number): Promise<HomeworkDto> {
    return this.homeworkService.getOneHomework(id);
  }

  @UseInterceptors(
    FileInterceptor('homeworkfile', {
      fileFilter: imageFileFilter,
    }),
  )
  @Post('/create')
  postHomeWork(
    @GetUser() user: User,
    @Body() homeworkDto: HomeworkDto,
    @UploadedFile() homeworkfile: Express.Multer.File,
  ): Promise<HomeworkDto> {
    return this.homeworkService.createHomework(homeworkDto, homeworkfile, user);
  }

  @UseInterceptors(
    FileInterceptor('homeworkfile', {
      fileFilter: imageFileFilter,
    }),
  )
  @Put('/update/:id')
  updateHomework(
    @GetUser() user: User,
    @Body() homeworkDto: HomeworkDto,
    @Param('id') id: number,
    @UploadedFile() homeWorkFile: Express.Multer.File,
  ) {
    return this.homeworkService.updateHomework(
      homeworkDto,
      homeWorkFile,
      user,
      id,
    );
  }
  @Delete('/delete/:id')
  deleteHomeWork(
    @GetUser() user: User,
    @Param('id') id: number,
  ): Promise<void> {
    return this.homeworkService.deleteHomework(user, id);
  }
}
