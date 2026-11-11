/**
 * DHARA — Master Database Seeder
 * Smart India Hackathon 2026 — Problem Statement 26016
 *
 * PRODUCTION SAFETY:
 *   This script uses SEED_PASSWORD_HASH from data.ts, which is the bcrypt hash
 *   of the publicly-known demo password "Bhumitra@2026".
 *
 *   When NODE_ENV=production, this script:
 *     1. REFUSES to run with the demo password hash.
 *     2. REQUIRES the SEED_PASSWORD environment variable to be set to a
 *        strong, unique password (minimum 16 characters).
 *     3. Generates a fresh bcrypt hash from SEED_PASSWORD at runtime.
 *
 *   This ensures production accounts are NEVER seeded with a publicly
 *   known credential, even if this script is run accidentally in production.
 *
 *   For production initial provisioning, run:
 *     SEED_PASSWORD=<strong-unique-password> NODE_ENV=production pnpm db:seed
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import {
  SEED_STATES,
  SEED_DISTRICTS,
  SEED_VILLAGES,
  SEED_ROLES,
  SEED_USERS,
  SEED_PASSWORD_HASH,
  SEED_PROJECTS,
  SEED_PARCELS,
  SEED_PRIORITY_ACTIONS,
  SEED_GRIEVANCES,
} from './data';

// ─── Known demo/insecure passwords that must never be used in production ──────
const KNOWN_DEMO_PASSWORDS = [
  'Bhumitra@2026',
  'bhumitra@2026',
  'password',
  'Password@123',
  'admin',
  'Admin@123',
];

const prisma = new PrismaClient();

/**
 * Returns the password hash to use for seeded accounts.
 *
 * In production: requires SEED_PASSWORD env var, refuses to use the demo hash.
 * In development: uses the pre-computed demo hash from data.ts.
 */
async function resolvePasswordHash(): Promise<string> {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Development / SIH demo: use the pre-computed demo hash.
    console.log('ℹ  Development mode: seeding with demo password hash (Bhumitra@2026).');
    console.log('   NEVER use this hash in production.');
    return SEED_PASSWORD_HASH;
  }

  // Production path: refuse the demo hash entirely.
  const seedPassword = process.env.SEED_PASSWORD;

  if (!seedPassword) {
    console.error('');
    console.error('❌ PRODUCTION SEED BLOCKED:');
    console.error('   NODE_ENV=production but SEED_PASSWORD is not set.');
    console.error('   Set a strong, unique password in the SEED_PASSWORD environment variable:');
    console.error('   SEED_PASSWORD=<min-16-char-strong-password> pnpm db:seed');
    console.error('');
    process.exit(1);
  }

  if (seedPassword.length < 16) {
    console.error('');
    console.error('❌ PRODUCTION SEED BLOCKED:');
    console.error(`   SEED_PASSWORD is too short (${seedPassword.length} chars). Minimum 16 characters.`);
    console.error('');
    process.exit(1);
  }

  if (KNOWN_DEMO_PASSWORDS.includes(seedPassword)) {
    console.error('');
    console.error('❌ PRODUCTION SEED BLOCKED:');
    console.error('   SEED_PASSWORD is set to a known demo/insecure value.');
    console.error('   Use a strong, randomly-generated password.');
    console.error('');
    process.exit(1);
  }

  // Generate a fresh bcrypt hash from the provided production password.
  console.log('🔐 Generating bcrypt hash for production seed password...');
  const hash = await bcrypt.hash(seedPassword, 12); // cost 12 for production
  console.log('✅ Production password hash generated (cost factor 12).');
  return hash;
}

async function main() {
  console.log('');
  console.log('🌱 Starting DHARA Master Database Seeding...');
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');

  const passwordHash = await resolvePasswordHash();

  // 1. Seed States
  for (const state of SEED_STATES) {
    await prisma.state.upsert({
      where: { code: state.code },
      update: state,
      create: state,
    });
  }
  console.log(`✅ Seeded ${SEED_STATES.length} States`);

  // 2. Seed Districts
  for (const district of SEED_DISTRICTS) {
    await prisma.district.upsert({
      where: { id: district.id },
      update: district,
      create: district,
    });
  }
  console.log(`✅ Seeded ${SEED_DISTRICTS.length} Districts`);

  // 3. Seed Villages
  for (const village of SEED_VILLAGES) {
    await prisma.village.upsert({
      where: { id: village.id },
      update: village,
      create: village,
    });
  }
  console.log(`✅ Seeded ${SEED_VILLAGES.length} Villages`);

  // 4. Seed Roles
  for (const role of SEED_ROLES) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: role,
      create: role,
    });
  }
  console.log(`✅ Seeded ${SEED_ROLES.length} Roles`);

  // 5. Seed Users — always uses the runtime-resolved hash, never the demo hash in production.
  for (const user of SEED_USERS) {
    await prisma.user.upsert({
      where: { officerId: user.officerId },
      update: {
        name: user.name,
        email: user.email,
        designation: user.designation,
        jurisdiction: user.jurisdiction,
        roleId: user.roleId,
        districtId: user.districtId,
        phone: user.phone,
        passwordHash,          // resolved hash — demo in dev, secure in production
      },
      create: {
        id: user.id,
        officerId: user.officerId,
        name: user.name,
        email: user.email,
        passwordHash,          // resolved hash — demo in dev, secure in production
        designation: user.designation,
        jurisdiction: user.jurisdiction,
        roleId: user.roleId,
        districtId: user.districtId,
        phone: user.phone,
      },
    });
  }
  console.log(`✅ Seeded ${SEED_USERS.length} Officer Accounts`);
  if (process.env.NODE_ENV === 'production') {
    console.log('   ⚠  Production: accounts seeded with SEED_PASSWORD (not the demo password).');
    console.log('   ⚠  Rotate SEED_PASSWORD after seeding. Do not leave it in environment.');
  }

  // 6. Seed Projects
  for (const project of SEED_PROJECTS) {
    await prisma.project.upsert({
      where: { projectCode: project.projectCode },
      update: project,
      create: project,
    });
  }
  console.log(`✅ Seeded ${SEED_PROJECTS.length} Flagship Projects`);

  // 7. Seed Parcels & Owners
  for (const parcelData of SEED_PARCELS) {
    const { owners, ...parcelFields } = parcelData;
    const parcel = await prisma.landParcel.upsert({
      where: { parcelNumber: parcelFields.parcelNumber },
      update: parcelFields,
      create: parcelFields,
    });

    if (owners && owners.length > 0) {
      await prisma.parcelOwner.deleteMany({ where: { parcelId: parcel.id } });
      for (const owner of owners) {
        await prisma.parcelOwner.create({
          data: {
            parcelId: parcel.id,
            name: owner.name,
            sharePercentage: owner.sharePercentage,
            bankAccountVerified: owner.bankAccountVerified,
            isMainOwner: owner.isMainOwner,
            phone: owner.phone,
          },
        });
      }
    }
  }
  console.log(`✅ Seeded ${SEED_PARCELS.length} Cadastral Parcels with Owners`);

  // 8. Seed Priority Actions
  for (const action of SEED_PRIORITY_ACTIONS) {
    const actionFields = {
      id: action.id,
      projectId: action.projectId,
      title: action.title,
      description: action.description,
      actionType: action.actionType,
      priority: action.priority,
      assignedRole: action.assignedRole,
      dueDate: action.dueDate,
      status: action.status,
      escalationLevel: action.escalationLevel,
    };
    await prisma.acquisitionAction.upsert({
      where: { id: action.id },
      update: actionFields,
      create: actionFields,
    });
  }
  console.log(`✅ Seeded ${SEED_PRIORITY_ACTIONS.length} Action Centre Priority Items`);

  // 9. Seed Grievances
  for (const grv of SEED_GRIEVANCES) {
    await prisma.grievance.upsert({
      where: { ticketNumber: grv.ticketNumber },
      update: grv,
      create: grv,
    });
  }
  console.log(`✅ Seeded ${SEED_GRIEVANCES.length} Grievance Objections`);

  console.log('');
  console.log('🌟 DHARA Master Database Seeding Completed Successfully!');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
