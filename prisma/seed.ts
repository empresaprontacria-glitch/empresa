import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando a criação dos dados iniciais...');

  // 1. Garante que o Nicho "BEAUTY" exista no banco
  const niche = await prisma.niche.upsert({
    where: { name: 'BEAUTY' },
    update: {},
    create: { name: 'BEAUTY' },
  }).catch(() => null);

  // Monta a relação do niche se ele existir
  const nicheRelation = niche ? { connect: { id: niche.id } } : undefined;

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
        ...(nicheRelation ? { niche: nicheRelation } : {}),
      },
    });
  }

  // 3. Criar ou buscar Tenant
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
        ...(nicheRelation ? { niche: nicheRelation } : {}),
      },
    });
    console.log(`✅ Tenant criado: ${tenant.name} (ID: ${tenant.id})`);
  }

  // 4. Criar Assinatura com a data final de período
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
      });
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