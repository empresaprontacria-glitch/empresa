import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando a criação dos dados iniciais...');

  // 1. Criar ou buscar o Plano Master
  const plan = await prisma.plan.create({
    data: {
      name: 'Plano Master',
      price: 99.90,
      hasAI: true,
      niche: 'BEAUTY',
    },
  }).catch(async () => {
    console.log('⚠️ Plano já existente, buscando existente...');
    return await prisma.plan.findFirst();
  });

  // 2. Criar Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Empresa Pronta',
      email: 'contato@empresapronta.com',
      phone: '98986275172',
      status: 'ACTIVE',
      niche: 'BEAUTY',
    },
  });

  console.log(`✅ Tenant criado: ${tenant.name} (ID: ${tenant.id})`);

  // 3. Criar Assinatura com currentPeriodEnd obrigatório
  if (plan) {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

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