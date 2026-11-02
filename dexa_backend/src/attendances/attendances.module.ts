import { TypeOrmModule } from '@nestjs/typeorm'
import { AttendancesService } from './attendances.service.js'
import { Attendance } from './attendance.entity.js'
import { AttendancesController } from './attendances.controller.js'
import { CloudinaryService } from './cloudinary.service.js'
import { Module } from '@nestjs/common'

@Module({
    imports: [TypeOrmModule.forFeature([Attendance])],
    controllers: [AttendancesController],
    providers: [AttendancesService, CloudinaryService],
    })

export class AttendancesModule {}
