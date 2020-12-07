import { IS_HIBANA_ENABLED } from 'cypress/constants';

const PAGE_URL = '/usage';

describe('The usage page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
    cy.stubRequest({
      url: `api/v1/billing/subscription`,
      fixture: 'billing/subscription/200.get.json',
      requestAlias: 'subscriptionReq',
    });
    cy.stubRequest({
      url: 'api/v1/account?include=usage',
      fixture: 'account/200.get.include-usage.json',
      requestAlias: 'accountReq',
    });
  });

  if (IS_HIBANA_ENABLED) {
    it('renders with a relevant page title ', () => {
      cy.stubRequest({
        url: '/api/v1/usage',
        fixture: 'usage/200.get.json',
        requestAlias: 'usageReq',
      });

      cy.stubRequest({
        url: '/api/v1/usage/history',
        fixture: 'usage/history/200.get.json',
        requestAlias: 'usageHistoryReq',
      });

      cy.visit(PAGE_URL);
      cy.wait(['@usageReq', '@usageHistoryReq', '@subscriptionReq', '@accountReq']);
      cy.title().should('include', 'Usage');
      cy.findByRole('heading', { name: 'Usage' }).should('be.visible');
    });

    it('renders three sections when rvUsage and both products are present', () => {
      cy.stubRequest({
        url: '/api/v1/usage',
        fixture: 'usage/200.get.json',
        requestAlias: 'usageReq',
      });

      cy.stubRequest({
        url: '/api/v1/usage/history',
        fixture: 'usage/history/200.get.json',
        requestAlias: 'usageHistoryReq',
      });

      cy.visit(PAGE_URL);
      cy.wait(['@usageReq', '@usageHistoryReq', '@subscriptionReq', '@accountReq']);
      cy.findByText('Messaging Usage').should('be.visible');
      cy.findByText('Feature Usage').should('be.visible');
      cy.findByText('Recipient Validation Usage').should('be.visible');
    });

    it('does not render recipient validation section when the user has no RV usage', () => {
      cy.stubRequest({
        url: '/api/v1/usage',
        fixture: 'usage/200.get.no-results.json',
        requestAlias: 'usageReq',
      });

      cy.stubRequest({
        url: '/api/v1/usage/history',
        fixture: 'usage/history/200.get.json',
        requestAlias: 'usageHistoryReq',
      });

      cy.visit(PAGE_URL);
      cy.wait(['@usageReq', '@usageHistoryReq', '@subscriptionReq', '@accountReq']);
      cy.findByRole('heading', { name: 'Messaging Usage' }).should('be.visible');
      cy.findByRole('heading', { name: 'Feature Usage' }).should('be.visible');
      cy.findByRole('heading', { name: 'Recipient Validation Usage' }).should('not.be.visible');
    });

    it('renders an error when a request fails, allowing the user to retry', () => {
      cy.visit(PAGE_URL);
      cy.stubRequest({
        url: '/api/v1/usage',
        statusCode: 400,
        fixture: '400.json',
        requestAlias: 'usageReq',
      });

      cy.stubRequest({
        url: '/api/v1/usage/history',
        fixture: 'usage/history/200.get.json',
        requestAlias: 'usageHistoryReq',
      });

      // Usage request occurs 3 times due to retries
      cy.wait(['@usageReq', '@usageHistoryReq', '@subscriptionReq', '@accountReq']);
      cy.wait('@usageReq');
      cy.wait('@usageReq');
      cy.findByRole('heading', { name: 'An error occurred' }).should('be.visible');

      cy.stubRequest({
        url: '/api/v1/usage',
        fixture: 'usage/200.get.json',
        requestAlias: 'successfulUsageReq',
      });
      cy.findByRole('button', { name: 'Try Again' }).click();
      cy.wait(['@successfulUsageReq', '@usageHistoryReq', '@subscriptionReq', '@accountReq']);
      cy.findByRole('heading', { name: 'Messaging Usage' }).should('be.visible');
      cy.findByRole('heading', { name: 'Feature Usage' }).should('be.visible');
      cy.findByRole('heading', { name: 'Recipient Validation Usage' }).should('be.visible');
    });
  }
});
