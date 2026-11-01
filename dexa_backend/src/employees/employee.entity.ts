import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export enum EmployeeRole {
  HRD = 'HRD',
  EMPLOYEE = 'EMPLOYEE',
}

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 150 })
  name!: string

  @Index({ unique: true })
  @Column({ length: 30 })
  nik!: string

  @Index({ unique: true })
  @Column({ length: 255 })
  email!: string

  @Column({ name: 'password_hash', select: false })
  passwordHash!: string

  @Column({ length: 100 })
  position!: string

  @Column({ length: 100 })
  department!: string

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone!: string | null

  @Column({ type: 'enum', enum: EmployeeRole, default: EmployeeRole.EMPLOYEE })
  role!: EmployeeRole

  @Column({ default: true })
  isActive!: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
