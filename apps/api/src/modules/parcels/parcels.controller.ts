import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ParcelsService } from './parcels.service';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@ApiTags('Land Parcels & Parcel 360')
@Controller('parcels')
export class ParcelsController {
  constructor(private readonly parcelsService: ParcelsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List cadastral land parcels — basic metadata only (public)' })
  @ApiResponse({ status: 200, description: 'List of land parcels (no PII)' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'state', required: false })
  @ApiQuery({ name: 'district', required: false })
  @ApiQuery({ name: 'stage', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getAll(
    @Query() query: {
      projectId?: string;
      state?: string;
      district?: string;
      stage?: string;
      search?: string;
    },
  ) {
    const items = await this.parcelsService.getAll(query);
    return {
      data: items,
      meta: {
        total: items.length,
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get parcel by ID or Survey Number (basic metadata, public)' })
  @ApiResponse({ status: 200, description: 'Parcel detail' })
  @ApiResponse({ status: 404, description: 'Parcel not found' })
  async getById(@Param('id') id: string) {
    const data = await this.parcelsService.getById(id);
    return { data };
  }

  // SEC-07 / SEC-09: Parcel 360 view contains owner PII, phone numbers, bank
  // account details, compensation amounts, and R&R entitlements.
  // Requires authentication and parcel:view permission.
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('parcel:view')
  @Get(':id/360')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Consolidated Parcel 360 — ownership, valuation, award, R&R, grievances (requires parcel:view)',
  })
  @ApiResponse({ status: 200, description: 'Consolidated Parcel 360 dossier' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Parcel record not found' })
  async getParcel360(@Param('id') id: string) {
    const data = await this.parcelsService.getParcel360(id);
    return { data };
  }
}
