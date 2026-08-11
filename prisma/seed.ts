import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando a criação dos dados iniciais...');

  // 1. Criar ou buscar o Nicho com slug
  let niche = await prisma.niche.findFirst({
    where: { slug: 'beauty' },
  });

  if (!niche) {
    niche = await prisma.niche.create({
      data: {
        name: 'BEAUTY',
        slug: 'beauty',
      },
    });
  }

  // 2. Criar ou buscar o Plano Master
  let plan = await prisma.plan.findFirst({
    where: { name: 'Plano Master' },
  });

  if (!plan) {
    plan = await prisma.plan.create({
      data: {
        name: 'Plano Master',
        price: 99.90,
        hasAI: true,
        niche: {
          connect: { id: niche.id },
        },
      } as any,
    });
  }

  // 3. Criar ou buscar o Tenant
  let tenant = await prisma.tenant.findFirst({
    where: { email: 'contato@empresapronta.com' },
  });

  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: 'Empresa Pronta',
        email: 'contato@empresapronta.com',
        phone: '98986275172',
        status: 'ACTIVE',
        niche: {
          connect: { id: niche.id },
        },
      } as any,
    });
    console.log(`✅ Tenant criado: ${tenant.name} (ID: ${tenant.id})`);
  }

  // 4. Criar Assinatura vinculada
  if (plan && tenant) {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    const subscription = await prisma.subscription.findFirst({
      where: { tenantId: tenant.id },
    });

    if (!subscription) {
      await prisma.subscription.create({
        data: {
          tenant: { connect: { id: tenant.id } },
          plan: { connect: { id: plan.id } },
          status: 'ACTIVE',
          currentPeriodEnd: nextYear,
        },
      } as any);
      console.log('✅ Assinatura vinculada com sucesso!');
    }
  }

  console.log('🎉 Seed executado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });