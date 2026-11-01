import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'
import { Attendance } from './attendance.entity.js'

export function todayWIB(): string {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta'}).format(new Date())
}

@Injectable()
export class AttendancesService {
    constructor(@InjectRepository(Attendance) private readonly attendances: Repository<Attendance>) {}

    async checkIn(employeeId: string, employeeName: string, photo: string, notes?: string) {
        const attedanceDate = todayWIB()
        const existing = await this.attendances.findOne({ where: { employeeId, attendanceDate: attedanceDate } })
        if (existing) throw new ConflictException('Karyawan sudah melakukan check-in hari ini.')

            return this.attendances.save(this.attendances.create({ employeeId, employeeName, attendanceDate: attedanceDate, photo, notes })) 
        }

    findMine(employeeId: string) {
        return this.attendances.find({ where: { employeeId }, order: { attendanceDate: 'DESC' } }) 
    }

    findToday(employeeId: string) {
        return this.attendances.findOne({ where: { employeeId, attendanceDate: todayWIB() } })
    }

    async findAll(query: { employeeId?: string; from?: string; to?: string; page?: number; limit?: number } ) {
        const page = Math.max(1, Number(query.page) || 1)
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 20))

        const [data, total] = await this.attendances.findAndCount({
            where: {
                ...(query.employeeId ? { employeeId: query.employeeId } : {}),
                ...(query.from && query.to ? { attendanceDate: Between(query.from, query.to) } : {}),
            },
            order: { attendanceDate: 'DESC', checkIn: 'DESC' },
            skip: (page - 1) * limit,
            take: limit
        })

        return { data, total, page, limit: limit }
    }
    }