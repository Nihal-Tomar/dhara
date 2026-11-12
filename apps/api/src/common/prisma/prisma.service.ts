import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private isConnected = false;

  constructor() {
    // SEC-04 / ITEM-5 FIXED: No hardcoded fallback URL.
    // If DATABASE_URL is not set, PrismaClient will throw at connect time.
    // The startup validation in main.ts (production) or EmbeddedPgService (dev)
    // ensures DATABASE_URL is always present before this constructor runs.
    super({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    const isProduction = process.env.NODE_ENV === 'production';

    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        await this.$connect();
        this.isConnected = true;
        this.logger.log('Connected to PostgreSQL + PostGIS database');
        return;
      } catch (error) {
        if (attempt === 5) {
          if (isProduction) {
            // SEC-04 FIXED: In production, a failed DB connection is fatal.
            // Never silently fall back to in-memory demo data in production.
            this.logger.error(
              `FATAL: Cannot connect to PostgreSQL after 5 attempts: ${(error as Error).message}. ` +
              'Refusing to serve requests with in-memory demo data in production.',
            );
            process.exit(1);
          }
          this.logger.warn(
            `PostgreSQL not connected (${(error as Error).message}). ` +
            'Operating with in-memory resilient data store for LOCAL DEVELOPMENT ONLY.',
          );
          this.isConnected = false;
        } else {
          this.logger.warn(`DB connect attempt ${attempt}/5 failed — retrying in 2s...`);
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.$disconnect();
    }
  }

  get isDbConnected(): boolean {
    return this.isConnected;
  }

  async checkHealth(): Promise<{ status: string; latencyMs: number }> {
    if (!this.isConnected) {
      return { status: 'disconnected', latencyMs: -1 };
    }
    const start = Date.now();
    try {
      await this.$queryRaw`SELECT 1`;
      return { status: 'connected', latencyMs: Date.now() - start };
    } catch {
      return { status: 'error', latencyMs: Date.now() - start };
    }
  }
}
