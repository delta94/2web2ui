import { IS_HIBANA_ENABLED } from 'cypress/constants';

const PAGE_URL = '/domains/details/fake-domain.com/verify-sending';

describe('The verify sending domain page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  if (IS_HIBANA_ENABLED) {
    describe('Verify Sending Domain Page', () => {
      beforeEach(() => {
        cy.stubRequest({
          url: '/api/v1/account',
          fixture: 'account/200.get.json',
          requestAlias: 'accountDomainsReq',
        });
      });

      it('renders with a relevant page title', () => {
        cy.stubRequest({
          url: '/api/v1/sending-domains/hello-world-there.com',
          fixture: 'sending-domains/200.get.unverified-dkim.json',
          requestAlias: 'unverifieddkimSendingDomains',
        });

        cy.visit('/domains/details/hello-world-there.com/verify-sending');
        cy.wait(['@accountDomainsReq', '@unverifieddkimSendingDomains']);

        cy.title().should('include', 'Verify Sending Domain');
        cy.findByRole('heading', { name: 'Verify Sending Domain' }).should('be.visible');
      });

      it('clicking on the Verify Domain renders success message on succesful verification of domain', () => {
        cy.stubRequest({
          url: '/api/v1/sending-domains/hello-world-there.com',
          fixture: 'sending-domains/200.get.unverified-dkim.json',
          requestAlias: 'unverifieddkimSendingDomains',
        });
        cy.stubRequest({
          method: 'POST',
          url: '/api/v1/sending-domains/hello-world-there.com/verify',
          fixture: 'sending-domains/verify/200.post.json',
          requestAlias: 'verifyDomain',
        });

        cy.visit('/domains/details/hello-world-there.com/verify-sending');

        cy.wait(['@accountDomainsReq', '@unverifieddkimSendingDomains']);

        cy.findAllByText('The TXT record has been added to the DNS provider.').should('be.visible');

        cy.findByLabelText('The TXT record has been added to the DNS provider.').check({
          force: true,
        });

        cy.findByRole('button', { name: 'Verify Domain' }).click();

        cy.wait('@verifyDomain');

        cy.findAllByText(
          'You have successfully verified DKIM record of hello-world-there.com',
        ).should('be.visible');
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
