const { AUTH } = require('./selectors/auth');
const ApiPage = require('./pages/ApiPage');
const DataFactory = require('./utils/dataFactory');

const testMassRegistry = {
  users: new Set(),
  products: new Set(),
};

const registerMassEntity = (entity, id) => {
  if (!id || !testMassRegistry[entity]) {
    return;
  }
  testMassRegistry[entity].add(id);
};

Cypress.Commands.add('login', (
  email = Cypress.env('ADMIN_EMAIL'),
  password = Cypress.env('ADMIN_PASSWORD')
) => {
  cy.visit('/');
  cy.get(AUTH.emailInput).type(email);
  cy.get(AUTH.passwordInput).type(password);
  cy.get(AUTH.submitBtn).click();
});

Cypress.Commands.add('apiLogin', (
  email = Cypress.env('ADMIN_EMAIL'),
  password = Cypress.env('ADMIN_PASSWORD')
) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL')}/login`,
    body: { email, password },
  }).then((response) => {
    expect(response.status).to.eq(200);
    return response.body.authorization;
  });
});

Cypress.Commands.add('loginBySession', (
  email = Cypress.env('ADMIN_EMAIL'),
  password = Cypress.env('ADMIN_PASSWORD')
) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL')}/login`,
    body: { email, password },
  }).then((response) => {
    const token = response.body.authorization;
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.setItem('serverest/userToken', token);
      win.localStorage.setItem('serverest/userEmail', email);
      win.localStorage.setItem('serverest/userName', Cypress.env('ADMIN_NAME'));
    });
    cy.reload();
  });
});
Cypress.Commands.add('createAdminSession', () => {
  const admin = DataFactory.adminUser();

  return ApiPage.createUser(admin)
    .then((res) => {
      expect(res.status).to.eq(201);
      const userId = res.body._id;
      return ApiPage.login(admin.email, admin.password).then((loginRes) => {
        expect(loginRes.status).to.eq(200);
        return { token: loginRes.body.authorization, userId };
      });
    });
});

Cypress.Commands.add('createUserByFactory', (base = {}, overrides = {}) => {
  const payload = DataFactory.user(base, overrides);
  return ApiPage.createUser(payload).then((response) => {
    expect(response.status).to.eq(201);
    registerMassEntity('users', response.body._id);
    return {
      payload,
      response,
      id: response.body._id,
    };
  });
});

Cypress.Commands.add('createProductByFactory', (token, base = {}, overrides = {}) => {
  const payload = DataFactory.product(base, overrides);
  return ApiPage.createProduct(payload, token).then((response) => {
    expect(response.status).to.eq(201);
    registerMassEntity('products', response.body._id);
    return {
      payload,
      response,
      id: response.body._id,
    };
  });
});

Cypress.Commands.add('cleanupTestMass', () => {
  const userIds = [...testMassRegistry.users];
  const productIds = [...testMassRegistry.products];

  testMassRegistry.users.clear();
  testMassRegistry.products.clear();

  if (!userIds.length && !productIds.length) {
    return cy.wrap(null);
  }

  return cy.apiLogin().then((token) => {
    return cy
      .wrap(productIds)
      .each((id) => ApiPage.deleteProduct(id, token))
      .then(() => cy.wrap(userIds).each((id) => ApiPage.deleteUser(id, token)));
  });
});
