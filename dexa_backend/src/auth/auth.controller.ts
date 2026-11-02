import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { Employee } from '../employees/employee.entity.js'
import { AuthService } from './auth.service.js'
import { JwtAuthGuard } from './jwt-auth.guard.js'
import { LoginDto } from './dto/login.dto.js'
import { ChangePasswordDto } from './dto/change-password.dto.js'

type AuthenticatedRequest = Request & { user: Employee }

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) { return this.auth.login(dto.email, dto.password) }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() request: AuthenticatedRequest) { return this.auth.getProfile(request.user) }

  @UseGuards(JwtAuthGuard)
  @Patch('password')
  changePassword(@Req() request: AuthenticatedRequest, @Body() dto: ChangePasswordDto) {
    return this.auth.changePassword(request.user, dto)
  }
}
