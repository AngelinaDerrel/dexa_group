import { TypeOrmModule } from '@nestjs/typeorm'
import { AttendancesService } from './attendances.service.js'
import { Attendance } from './attendance.entity.js'
import { Module } from '@nestjs/common'

@Module({
    imports: [TypeOrmModule.forFeature([Attendance])],
    providers: [AttendancesService],
    })

export class AttendancesModule {}
