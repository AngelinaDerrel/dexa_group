import 'reflect-metadata'
import { config } from 'dotenv'
import { DataSource } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { Employee, EmployeeRole } from '../employees/employee.entity.js'

config()

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Employee],
  synchronize: true,
})

async function seed() {
  await dataSource.initialize()
  const repository = dataSource.getRepository(Employee)
  const email = process.env.HRD_EMAIL ?? 'hrd@dexagroup.com'
  const existing = await repository.findOne({ where: { email } })
  if (!existing) {
    await repository.save(repository.create({
      name: process.env.HRD_NAME ?? 'HRD Dexa Group',
      nik: 'HRD-001',
      email,
      passwordHash: await bcrypt.hash(process.env.HRD_PASSWORD ?? 'ChangeMe123!', 12),
      position: 'Human Resources Development',
      department: 'Human Resources',
      role: EmployeeRole.HRD,
      isActive: true,
    }))
    console.log(`HRD user created: ${email}`)
  } else {
    console.log(`HRD user already exists: ${email}`)
  }
  await dataSource.destroy()
}

seed().catch(async (error: unknown) => {
  console.error(error)
  if (dataSource.isInitialized) await dataSource.destroy()
  process.exitCode = 1
})
