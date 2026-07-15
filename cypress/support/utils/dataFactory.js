const { faker } = require('@faker-js/faker');

const getRunSeed = () => {
  const runId = Cypress.env('RUN_ID');
  if (runId) {
    return String(runId);
  }
  return String(Date.now());
};

const uniqueSuffix = () => `${getRunSeed()}-${faker.string.alphanumeric(6).toLowerCase()}`;

const DataFactory = {
  adminUser(overrides = {}) {
    const suffix = uniqueSuffix();
    return {
      nome: `QA Admin ${suffix}`,
      email: `qa.admin.${suffix}@example.com`,
      password: 'Senha123!',
      administrador: 'true',
      ...overrides,
    };
  },

  user(base = {}, overrides = {}) {
    const suffix = uniqueSuffix();
    return {
      nome: base.nome ? `${base.nome} ${suffix}` : `Test User ${suffix}`,
      email: base.email ? base.email : `test.user.${suffix}@example.com`,
      password: base.password || 'Senha123!',
      administrador: typeof base.administrador === 'string' ? base.administrador : 'true',
      ...overrides,
    };
  },

  product(base = {}, overrides = {}) {
    const suffix = uniqueSuffix();
    return {
      nome: base.name ? `${base.name} ${suffix}` : `Test Product ${suffix}`,
      preco: Number(base.price || 99),
      descricao: base.description || `Produto de teste ${suffix}`,
      quantidade: Number(base.quantity || 10),
      ...overrides,
    };
  },
};

module.exports = DataFactory;
