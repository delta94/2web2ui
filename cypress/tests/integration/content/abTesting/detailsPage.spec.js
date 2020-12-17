const PAGE_URL = `/ab-testing/stubbed-ab-test`;

// TODO: These tests need to be fleshed out further to test non-happy paths as well as scheduling tests

describe('The A/B Testing details page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  it('renders version 1', () => {
    cy.stubRequest({
      url: '/api/v1/ab-test/stubbed-ab-test*',
      fixture: 'ab-test/stubbed-ab-test/200.get.json',
      requestAlias: 'abTestReq',
    });
    cy.visit(`${PAGE_URL}/1`);
    cy.wait('@abTestReq');

    cy.findByRole('heading', { name: 'Stubbed AB Test' }).should('be.visible');
    cy.findByText('stubbed-ab-test').should('be.visible');
    cy.findByLabelText('Test Name').should('have.value', 'Stubbed AB Test');
  });
});
