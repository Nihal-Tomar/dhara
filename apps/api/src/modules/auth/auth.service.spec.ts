import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DataStoreService } from '../../common/data-store/data-store.service';

describe('AuthService', () => {
  let authService: AuthService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthService,
        DataStoreService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mock-jwt-token-sih-2026'),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              // Provide a valid test JWT secret so getJwtSecret() does not throw
              if (key === 'JWT_SECRET') return 'test_jwt_secret_at_least_32_characters_long_for_sih_tests';
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    // Properly close the NestJS testing module so async handles are released.
    await module.close();
  });

  describe('login', () => {
    it('should authenticate District Collector by officerId', async () => {
      const result = await authService.login({
        userId: 'GJ-DM-VD-0042',
        password: 'Bhumitra@2026',
      });

      expect(result.accessToken).toBe('mock-jwt-token-sih-2026');
      expect(result.user.officerId).toBe('GJ-DM-VD-0042');
      expect(result.user.name).toContain('Rajesh Sharma');
      expect(result.user.role).toBe('DISTRICT_COLLECTOR');
    });

    it('should authenticate by email', async () => {
      const result = await authService.login({
        email: 'rajesh.sharma@ias.gov.in',
        password: 'Bhumitra@2026',
      });

      expect(result.accessToken).toBe('mock-jwt-token-sih-2026');
      expect(result.user.role).toBe('DISTRICT_COLLECTOR');
    });

    it('should authenticate CALA officer', async () => {
      const result = await authService.login({
        email: 'priya.meena@ras.gov.in',
        password: 'Bhumitra@2026',
      });

      expect(result.user.role).toBe('CALA');
    });

    it('should authenticate Tehsildar', async () => {
      const result = await authService.login({
        email: 'amit.verma@uprevenue.gov.in',
        password: 'Bhumitra@2026',
      });

      expect(result.user.role).toBe('TEHSILDAR');
    });

    it('should authenticate Super Admin', async () => {
      const result = await authService.login({
        email: 'admin@bhumitra.gov.in',
        password: 'Bhumitra@2026',
      });

      expect(result.user.role).toBe('SUPER_ADMIN');
    });

    it('should reject invalid password', async () => {
      await expect(
        authService.login({
          userId: 'GJ-DM-VD-0042',
          password: 'WrongPassword@123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    // SEC-01: Verify master-password bypass is removed.
    // 'Bhumitra@2026' must NOT be a universal passphrase — it only works because
    // it is the actual bcrypt-hashed password stored for seeded users.
    it('should reject the universal password for a non-existent user', async () => {
      await expect(
        authService.login({
          userId: 'NON-EXISTENT-OFFICER',
          password: 'Bhumitra@2026',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    // SEC-02: Verify SSO bypass is removed — authMode:'sso' must not skip password check.
    it('should reject login with authMode sso and no password', async () => {
      await expect(
        authService.login({
          userId: 'GJ-DM-VD-0042',
          authMode: 'sso',
          // no password provided
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should reject non-existent officer ID', async () => {
      await expect(
        authService.login({
          userId: 'NON-EXISTENT-999',
          password: 'Bhumitra@2026',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should reject non-existent email', async () => {
      await expect(
        authService.login({
          email: 'nonexistent@gov.in',
          password: 'Bhumitra@2026',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should reject missing credentials', async () => {
      await expect(
        authService.login({} as any),
      ).rejects.toThrow();
    });
  });
});
