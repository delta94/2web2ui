import { IS_HIBANA_ENABLED } from 'cypress/constants';

const PAGE_URL = '/domains/details/fake-domain.com/verify-tracking';

describe('The verify tracking domain page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  if (IS_HIBANA_ENABLED) {
    describe('Verify Tracking Domain Page', () => {
      beforeEach(() => {
        cy.stubRequest({
          url: '/api/v1/account',
          fixture: 'account/200.get.json',
          requestAlias: 'accountDomainsReq',
        });
      });

      it('renders with a relevant page title', () => {
        let domainName = 'blah231231231.gmail.com';
        cy.stubRequest({
          url: '/api/v1/tracking-domains',
          fixture: 'tracking-domains/200.get.domain-details.json',
          requestAlias: 'trackingDomainsList',
        });

        cy.visit(`/domains/details/${domainName}/verify-tracking`);

        cy.wait(['@accountDomainsReq', '@trackingDomainsList']);

        cy.title().should('include', 'Verify Tracking Domain');
        cy.findByRole('heading', { name: 'Verify Tracking Domain' }).should('be.visible');
      });

      it('redirects to domains list page when domain not found', () => {
        let domainName = 'domain.not.found';
        cy.stubRequest({
          url: '/api/v1/tracking-domains',
          fixture: 'tracking-domains/200.get.domain-details.json',
          requestAlias: 'trackingDomainsList',
        });

        cy.visit(`/domains/details/${domainName}/verify-tracking`);

        cy.wait(['@accountDomainsReq', '@trackingDomainsList']);

        cy.title().should('include', 'Domains');
        cy.findByRole('heading', { name: 'Domains' }).should('be.visible');
        cy.findAllByText('Domain domain.not.found not found').should('be.visible');
      });
    });
  }

  if (!IS_HIBANA_ENABLED) {
    it('renders the 404 page when the user does not have Hibana enabled', () => {
      cy.visit(PAGE_URL);

      cy.findByRole('heading', { name: 'Page Not Found' }).should('be.visible');
    });
  }
});
