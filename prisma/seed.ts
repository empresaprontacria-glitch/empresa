import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando a criação dos dados iniciais...');

  // 1. Criar Plano Padrão
  const plan = await prisma.plan.create({
    data: {
      name: 'Plano Master',
      price: 99.90,
      hasAI: true,
    },
  }).catch(() => {
    console.log('⚠️ Plano já existente ou estrutura modificada, pulando criação de plano.');
    return null;
  });

  // 2. Criar Tenant (com o campo email obrigatório)
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Empresa Pronta',
      email: 'contato@empresapronta.com',
      status: 'ACTIVE',
    },
  });

  console.log(`✅ Tenant criado: ${tenant.name} (ID: ${tenant.id})`);

  // 3. Criar Assinatura para o Tenant (se o plano foi criado)
  if (plan) {
    await prisma.subscription.create({
      data: {
        tenantId: tenant.id,
        planId: plan.id,
        status: 'ACTIVE',
      },
    });
    console.log('✅ Assinatura vinculada ao plano Master.');
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