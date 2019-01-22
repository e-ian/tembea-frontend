describe('Hello Angular', () => {
  // load http://localhost:4200 before each test
  beforeEach(() => cy.visit('http://localhost:4200'));

  it('should display welcome message', () => {
    cy.get('app-root h1').contains('Welcome to tembea-frontend!');
  });
});
