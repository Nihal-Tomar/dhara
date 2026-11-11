import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { LoginDto, AuthResponse, UserSession } from '@bhumitra/types';

@ApiTags('Authentication & Identity')
@Controller('auth')
// SEC-10: Stricter rate limit on all auth endpoints — 20 attempts per minute per IP.
@Throttle({ default: { ttl: 60_000, limit: 20 } })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Officer authentication via credentials or SSO preset' })
  @ApiResponse({ status: 200, description: 'JWT authentication successful' })
  @ApiResponse({ status: 401, description: 'Invalid officer credentials' })
  async login(@Body() loginDto: LoginDto): Promise<{ data: AuthResponse; meta: { timestamp: string } }> {
    const authData = await this.authService.login(loginDto);
    return {
      data: authData,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh JWT access token using refresh token' })
  @ApiResponse({ status: 200, description: 'Access token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Body() body: { refreshToken: string }) {
    const data = await this.authService.refreshToken(body.refreshToken);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update officer password with verification of existing password' })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 401, description: 'Current password mismatch' })
  async changePassword(
    @CurrentUser() user: UserSession,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    const data = await this.authService.changePassword(user.id, body.currentPassword, body.newPassword);
    return { data };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Officer session termination' })
  logout(): { data: { message: string } } {
    return {
      data: {
        message: 'Officer logged out successfully',
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current authenticated officer profile and permissions' })
  @ApiResponse({ status: 200, description: 'Authenticated officer profile' })
  getProfile(@CurrentUser() user: UserSession): { data: UserSession } {
    return {
      data: user,
    };
  }

  @Public()
  @Post('otp/send')
  @HttpCode(HttpStatus.SERVICE_UNAVAILABLE)
  @ApiOperation({ summary: 'Send OTP via Aadhaar/Officer SSO (not yet implemented)' })
  sendOtp(@Body() _body: { aadhaarNumber?: string; phone?: string }) {
    // SEC-02 FIXED: The demo OTP endpoint previously returned a hardcoded OTP
    // in the response body, allowing unauthenticated access to any officer account.
    // Real OTP/SSO integration requires a registered federated identity provider.
    // This endpoint is disabled until a production-grade SSO integration is built.
    return {
      error: {
        code: 'SSO_NOT_IMPLEMENTED',
        message:
          'SSO/OTP authentication is not yet integrated with a production identity provider. ' +
          'Use credential-based login via POST /auth/login.',
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      },
    };
  }

  @Public()
  @Post('otp/verify')
  @HttpCode(HttpStatus.SERVICE_UNAVAILABLE)
  @ApiOperation({ summary: 'Verify OTP via Aadhaar/Officer SSO (not yet implemented)' })
  verifyOtp(@Body() _body: { otp: string; userId?: string }) {
    // SEC-02 FIXED: This endpoint previously granted valid JWTs for any user ID
    // with authMode:'sso', bypassing all authentication. Disabled.
    return {
      error: {
        code: 'SSO_NOT_IMPLEMENTED',
        message:
          'SSO/OTP authentication is not yet integrated with a production identity provider. ' +
          'Use credential-based login via POST /auth/login.',
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      },
    };
  }
}
