import { IS_HIBANA_ENABLED, USERNAME } from 'cypress/constants';

const PAGE_URL = '/';

if (!IS_HIBANA_ENABLED) {
  // Pulled out of `beforeEach()` as this is needed in most tests, but not all
  function beforeSteps() {
    cy.stubRequest({
      url: 'api/v1/users/mockuser/two-factor',
      fixture: 'users/two-factor/200.get.json',
    });

    cy.stubRequest({
      url: 'api/v1/users/mockuser/two-factor/backup',
      fixture: 'users/two-factor/backup/200.get.json',
    });
  }

  describe('Hibana theme toggling UI', () => {
    beforeEach(() => {
      cy.stubAuth();
      cy.login({ isStubbed: true });
    });

    it('does not render the Hibana banner if the user UI option "isHibanaBannerVisible" is false', () => {
      cy.stubRequest({
        url: '/api/v1/users/mockuser',
        fixture: 'users/200.get.hibana-banner-is-not-visible.json',
      });

      cy.visit(PAGE_URL);

      cy.findByDataId('hibana-controls').should('not.be.visible');
    });

    it('navigates the user to the profile page and dismisses the banner when clicking "Turn it on to see our new look!"', () => {
      beforeSteps();
      cy.stubRequest({
        url: `/api/v1/users/${USERNAME}`,
        fixture: 'users/200.get.hibana-banner-is-visible.json',
        requestAlias: 'userReq',
      });
      cy.visit(PAGE_URL);
      cy.wait('@userReq');

      if (!IS_HIBANA_ENABLED) {
        cy.stubRequest({
          url: 'api/v1/users/mockuser',
          method: 'PUT',
          fixture: 'users/200.put.update-ui-options.json',
          requestAlias: 'updateUIOptions',
        });

        cy.findByDataId('hibana-controls').within(() => {
          cy.findByText('Turn it on to see our new look!').click();
          cy.wait('@updateUIOptions').then(xhr => {
            expect(xhr.request.body).to.deep.equal({
              options: { ui: { isHibanaBannerVisible: false } },
            });
          });
        });

        cy.findByDataId('hibana-controls').should('not.be.visible');
        cy.url().should('include', '/account/profile');
        cy.title().should('include', 'Profile');
      }
    });

    it('dismisses the banner when the user clicks the dismiss button', () => {
      beforeSteps();
      cy.stubRequest({
        url: `/api/v1/users/${USERNAME}`,
        fixture: 'users/200.get.hibana-banner-is-visible.json',
        requestAlias: 'userReq',
      });
      cy.visit(PAGE_URL);
      cy.wait('@userReq');

      if (!IS_HIBANA_ENABLED) {
        cy.stubRequest({
          url: 'api/v1/users/mockuser',
          method: 'PUT',
          fixture: 'users/200.put.update-ui-options.json',
          requestAlias: 'updateUIOptions',
        });

        cy.findByDataId('hibana-controls').within(() => {
          cy.findByText('Dismiss').click({ force: true }); // `force` required because this is ScreenReaderOnly content
          cy.wait('@updateUIOptions').then(xhr => {
            expect(xhr.request.body).to.deep.equal({
              options: { ui: { isHibanaBannerVisible: false } },
            });
          });

          cy.findByDataId('hibana-controls').should('not.be.visible');
        });
      }
    });
  });
}
