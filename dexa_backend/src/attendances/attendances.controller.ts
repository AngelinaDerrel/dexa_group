import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { Roles } from '../auth/roles.decorator.js'
import { RolesGuard } from '../auth/roles.guard.js'
import { EmployeeRole } from '../employees/employee.entity.js'
import { AttendancesService } from './attendances.service.js'
import { CloudinaryService } from './cloudinary.service.js'

interface UploadPhoto {
  buffer: Buffer
  mimetype: string
}

const SUPPORTED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

@Controller('attendances')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendancesController {
  constructor(
    private readonly attendancesService: AttendancesService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  @Post('check-in')
  @Roles(EmployeeRole.EMPLOYEE, EmployeeRole.HRD)
  @UseInterceptors(FileInterceptor('photo', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async checkIn(
    @Req() req: { user: { id: string; name: string } },
    @UploadedFile() photo?: UploadPhoto,
    @Body('notes') notes?: string,
  ) {
    if (!photo) throw new BadRequestException('Foto bukti wajib diupload.')

    if (!SUPPORTED_MIME_TYPES.has(photo.mimetype)) {
      throw new BadRequestException('Foto harus berformat JPG, PNG, atau WEBP.')
    }

    if (await this.attendancesService.findToday(req.user.id)) {
      throw new ConflictException('Kamu sudah absen hari ini.')
    }

    const uploadedPhoto = await this.cloudinary.uploadAttendancePhoto(photo.buffer)

    return this.attendancesService.checkIn(
      req.user.id,
      req.user.name,
      uploadedPhoto.secure_url,
      notes?.slice(0, 255),
    )
  }

  @Get('me')
  @Roles(EmployeeRole.EMPLOYEE, EmployeeRole.HRD)
  findMine(@Req() req: { user: { id: string } }) {
    return this.attendancesService.findMine(req.user.id)
  }

  @Get('me/today')
  @Roles(EmployeeRole.EMPLOYEE, EmployeeRole.HRD)
  findToday(@Req() req: { user: { id: string } }) {
    return this.attendancesService.findToday(req.user.id)
  }

  @Get()
  @Roles(EmployeeRole.HRD)
  findAll(
    @Query('employeeId') employeeId?: string,
    @Query('search') search?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.attendancesService.findAll({ employeeId, search, from, to, page, limit })
}
}