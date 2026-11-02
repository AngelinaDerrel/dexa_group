import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('attendances')
@Index(['employeeId', 'attendanceDate'], { unique: true })
export class Attendance {
  @PrimaryGeneratedColumn({ name: 'id_attendance' })
  id!: number

  @Column({ name: 'employee_id', length: 36 })
  employeeId!: string

  @Column({ name: 'employee_name', length: 150 })
  employeeName!: string

  @Column({ name: 'attendance_date', type: 'date' })
  attendanceDate!: string

  @CreateDateColumn({ name: 'check_in' })
  checkIn!: Date

  @Column({ length: 1000 })
  photo!: string

  @Column({ length: 255, default: '' })
  notes!: string
}