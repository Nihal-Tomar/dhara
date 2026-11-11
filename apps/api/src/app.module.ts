import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { EmbeddedPgModule } from './common/embedded-pg/embedded-pg.module';
import { DataStoreModule } from './common/data-store/data-store.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ParcelsModule } from './modules/parcels/parcels.module';
import { GisModule } from './modules/gis/gis.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { CompensationModule } from './modules/compensation/compensation.module';
import { RehabilitationModule } from './modules/rehabilitation/rehabilitation.module';
import { GrievancesModule } from './modules/grievances/grievances.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { FieldModule } from './modules/field/field.module';
import { AuditModule } from './modules/audit/audit.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // SEC-10: Rate limiting — applied globally via APP_GUARD below.
    // Auth endpoints get a stricter limit (20 req/min) via @Throttle() override.
    // The default allows 100 requests per 60 seconds per IP.
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,  // 60 seconds window
        limit: 100,   // 100 requests per window
      },
    ]),

    // EmbeddedPgModule MUST come before PrismaModule so the embedded server
    // starts and patches DATABASE_URL before Prisma attempts to connect.
    EmbeddedPgModule,
    DataStoreModule,
    PrismaModule,
    HealthModule,
    AuthModule,
    ProjectsModule,
    ParcelsModule,
    GisModule,
    WorkflowModule,
    CompensationModule,
    RehabilitationModule,
    GrievancesModule,
    AnalyticsModule,
    NotificationsModule,
    DocumentsModule,
    FieldModule,
    AuditModule,
    ReportsModule,
    AiModule,
  ],
  controllers: [],
  providers: [
    // SEC-10: Register ThrottlerGuard globally so every endpoint is rate-limited.
    // Individual endpoints can override via @Throttle() or @SkipThrottle().
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
