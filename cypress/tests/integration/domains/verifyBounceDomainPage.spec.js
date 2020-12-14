import { IS_HIBANA_ENABLED } from 'cypress/constants';
const BASE_URL = '/domains/details/';
const PAGE_URL = '/domains/details/fake-domain.com/verify-bounce';

describe('The verify bounce domain page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  if (IS_HIBANA_ENABLED) {
    describe('Verify Bounce Domain Page', () => {
      beforeEach(() => {
        cy.stubRequest({
          url: '/api/v1/account',
          fixture: 'account/200.get.json',
          requestAlias: 'accountDomainsReq',
        });
      });

      it('renders with a relevant page title', () => {
        cy.stubRequest({
          url: '/api/v1/sending-domains/prd2.splango.net',
          fixture: 'sending-domains/200.get.unverified-bounce.json',
          requestAlias: 'unverifiedBounceDomains',
        });

        cy.visit(BASE_URL + 'prd2.splango.net/verify-bounce');

        cy.title().should('include', 'Verify Bounce Domain');
        cy.findByRole('heading', { name: 'Verify Bounce Domain' }).should('be.visible');
      });

      it('clicking on Verify Bounce, displays a success message', () => {
        cy.stubRequest({
          url: '/api/v1/sending-domains/prd2.splango.net',
          fixture: 'sending-domains/200.get.unverified-bounce.json',
          requestAlias: 'unverifiedBounceDomains',
        });
        cy.stubRequest({
          method: 'POST',
          url: '/api/v1/sending-domains/prd2.splango.net/verify',
          fixture: 'sending-domains/verify/200.post.json',
          requestAlias: 'verifyDomain',
        });
        cy.visit(BASE_URL + 'prd2.splango.net/verify-bounce');
        cy.wait(['@accountDomainsReq', '@unverifiedBounceDomains']);
        cy.findAllByLabelText('The CNAME record has been added to the DNS provider.').click({
          force: true,
        });
        cy.findByRole('button', { name: 'Verify Bounce' }).click();
        cy.wait('@verifyDomain');
        cy.findAllByText('You have successfully verified cname record of prd2.splango.net').should(
          'be.visible',
        );
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
