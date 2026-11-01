import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module.js'
import { Employee } from './employees/employee.entity.js'
import { EmployeesModule } from './employees/employees.module.js'
import { Attendance } from './attendances/attendance.entity.js'
import { AttendancesModule } from './attendances/attendances.module.js'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.getOrThrow<string>('DB_HOST'),
        port: Number(config.get('DB_PORT', 3306)),
        username: config.getOrThrow<string>('DB_USERNAME'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_NAME'),
        entities: [Employee, Attendance],
        synchronize: config.get<boolean>('DB_SYNCHRONIZE', true),
      }),
    }),
    AuthModule,
    EmployeesModule,
    AttendancesModule,
  ],
})
export class AppModule {}
