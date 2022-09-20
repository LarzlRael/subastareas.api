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
import { User } from '../auth/entities/user.entity';
import { HomeworkDto } from './dto/Homework.dto';
import { GetUser } from '../auth/decorators/get-user..decorator';
import { AuthGuard } from '@nestjs/passport';
import { Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

/* import { RolesGuard } from '../auth/guard/roles.guard'; */
import { HomeWorkStatusEnum } from '../enums/enums';
import { Homework } from './entities/Homework.entity';
import { fileFilter } from '../utils/utils';

@Controller('homework')
export class HomeworkController {
  constructor(private homeworkService: HomeworkService) {}

  @Get()
  getApprovedHomeWorks(): Promise<Homework[]> {
    return this.homeworkService.getApprovedHomeWorks();
  }
  @Get('/getSubjectsList')
  getSubjectsAndLevels() {
    return this.homeworkService.getSubjectsAndLevels();
  }
  @Get('/category/:category')
  getApprovedHomeWorksByCategory(@Param('category') category: string) {
    return this.homeworkService.getHomeworkByCategory(category.split(','));
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/homeworksbyuser')
  getHomeWorksByUser(@GetUser() user: User): Promise<Homework[]> {
    return this.homeworkService.getHomeworkByUser(user);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/getuserpendingofferaccept')
  getUserPendingOfferAccept(@GetUser() user: User): Promise<Homework[]> {
    return this.homeworkService.getUserPendingOfferAccept(user);
  }

  @Get('/homeworkstatus/:status')
  getHomeworksPending(
    @Param('status') status: HomeWorkStatusEnum,
  ): Promise<Homework[]> {
    return this.homeworkService.getPendingHomework(status);
  }

  @Get('/getonehomework/:id')
  getOneHomeWork(@Param('id') id: number) {
    return this.homeworkService.getOneHomework(id);
  }

  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  async postHomeWork(
    @GetUser() user: User,
    @Body() homeworkDto: HomeworkDto,
    @UploadedFile() homeworkFile: Express.Multer.File,
  ): Promise<Homework> {
    return await this.homeworkService.createHomework(
      homeworkDto,
      homeworkFile,
      user,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  @Put('/updateHomework/:id')
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

  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/:id')
  deleteHomeWork(
    @GetUser() user: User,
    @Param('id') id: number,
  ): Promise<void> {
    return this.homeworkService.deleteHomework(user, id);
  }
}
