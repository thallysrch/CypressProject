require('./commands');

beforeEach(() => {
	cy.clearCookies();
	cy.clearLocalStorage();
});

afterEach(() => {
	cy.cleanupTestMass();
});
