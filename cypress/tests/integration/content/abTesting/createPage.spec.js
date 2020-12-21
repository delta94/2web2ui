const PAGE_URL = '/ab-testing/create';

// TODO: These tests need to be fleshed out further to test non-happy paths

describe('The A/B Testing create page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  it('creates a new A/B test after submitting the form', () => {
    cy.stubRequest({
      url: '/api/v1/templates',
      fixture: 'templates/200.get.published-and-draft-results.json',
      requestAlias: 'templatesReq',
    });
    cy.stubRequest({
      url: '/api/v1/ab-test/**/*',
      method: 'POST',
      fixture: 'ab-test/stubbed-ab-test/200.post.json',
      requestAlias: 'abTestPost',
    });
    cy.stubRequest({
      url: '/api/v1/subaccounts',
      fixture: 'subaccounts/200.get.json',
      requestAlias: 'subaccountsReq',
    });
    cy.stubRequest({
      url: '/api/v1/ab-test/stubbed-ab-test*',
      fixture: 'ab-test/stubbed-ab-test/200.get.json',
      requestAlias: 'abTestGet',
    });
    cy.visit(PAGE_URL);
    cy.wait(['@subaccountsReq', '@templatesReq']);

    cy.findByLabelText('A/B test name').type('Stubbed AB Test');
    cy.findByLabelText('Default template').type('stubbed-template-2');
    cy.findByRole('option', { name: 'stubbed-template-2' }).click();
    cy.findByLabelText('Default template').should('have.value', 'stubbed-template-2');
    cy.findByRole('button', { name: 'Continue' }).click();

    cy.wait('@abTestPost').then(({ request }) => {
      const { body } = request;

      cy.wrap(body.default_template.template_id).should('eq', 'stubbed-template-2');
      cy.wrap(body.id).should('eq', 'stubbed-ab-test');
      cy.wrap(body.name).should('eq', 'Stubbed AB Test');
    });

    cy.wait('@abTestGet');

    cy.findByText('A/B test draft created').should('be.visible');
    cy.url().should('include', '/ab-testing/stubbed-ab-test/1');
  });
});
