import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
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

    async findAll(query: { employeeId?: string; search?: string; from?: string; to?: string; page?: number; limit?: number }) {
            const page = Math.max(1, Number(query.page) || 1)
            const limit = Math.min(100, Math.max(1, Number(query.limit) || 20))
            const qb = this.attendances.createQueryBuilder('a')

            if (query.employeeId) qb.andWhere('a.employeeId = :employeeId', { employeeId: query.employeeId })
            if (query.from && query.to) qb.andWhere('a.attendanceDate BETWEEN :from AND :to', { from: query.from, to: query.to })

            const search = query.search?.trim()
            if (search) {
                qb.andWhere(
                    'a.employeeName LIKE :search',
                    { search: `%${search}%` },
                )
            }

            const [data, total] = await qb
                .orderBy('a.attendanceDate', 'DESC')
                .addOrderBy('a.checkIn', 'DESC')
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount()

            return { data, total, page, limit }
        }
    }