import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { EmployeeRole } from '../employees/employee.entity.js'
import { ROLES_KEY } from './roles.decorator.js'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<EmployeeRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()])
    if (!roles?.length) return true
    const request = context.switchToHttp().getRequest<{ user?: { role: EmployeeRole } }>()
    return Boolean(request.user && roles.includes(request.user.role))
  }
}
