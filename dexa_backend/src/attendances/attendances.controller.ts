import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
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

interface UploadPhoto {
  buffer: Buffer
  mimetype: string
}

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'attendance')
const EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
}

@Controller('attendances')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  // Karyawan: absen + upload foto bukti WFH
  @Post('check-in')
  @Roles(EmployeeRole.EMPLOYEE)
  @UseInterceptors(FileInterceptor('photo', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async checkIn(
    @Req() req: { user: { id: string; name: string } },
    @UploadedFile() photo?: UploadPhoto,
    @Body('notes') notes?: string,
  ) {
    if (!photo) throw new BadRequestException('Foto bukti wajib diupload.')

    const extension = EXTENSIONS[photo.mimetype]
    if (!extension) throw new BadRequestException('Foto harus berformat JPG, PNG, atau WEBP.')

    // Cek dulu sebelum menyimpan file, supaya tidak ada foto yatim
    if (await this.attendancesService.findToday(req.user.id)) {
      throw new ConflictException('Kamu sudah absen hari ini.')
    }

    const filename = `${randomUUID()}${extension}`
    await mkdir(UPLOAD_DIR, { recursive: true })
    await writeFile(join(UPLOAD_DIR, filename), photo.buffer)

    return this.attendancesService.checkIn(
      req.user.id,
      req.user.name,
      `uploads/attendance/${filename}`,
      notes?.slice(0, 255),
    )
  }

  // Karyawan: riwayat absen saya
  @Get('me')
  @Roles(EmployeeRole.EMPLOYEE)
  findMine(@Req() req: { user: { id: string } }) {
    return this.attendancesService.findMine(req.user.id)
  }

  // Karyawan: sudah absen hari ini atau belum
  @Get('me/today')
  @Roles(EmployeeRole.EMPLOYEE)
  findToday(@Req() req: { user: { id: string } }) {
    return this.attendancesService.findToday(req.user.id)
  }

  // HRD: lihat semua absen (view only)
  @Get()
  @Roles(EmployeeRole.HRD)
  findAll(
    @Query('employeeId') employeeId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.attendancesService.findAll({ employeeId, from, to, page, limit })
  }
}