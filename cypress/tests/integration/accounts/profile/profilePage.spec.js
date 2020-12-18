import { IS_HIBANA_ENABLED } from 'cypress/constants';

const PAGE_URL = '/account/profile';

// TODO: Need to flesh out tests for this page

describe('The profile page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });

    cy.stubRequest({
      url: 'api/v1/users/mockuser/two-factor',
      fixture: 'users/two-factor/200.get.json',
    });
    cy.stubRequest({
      url: 'api/v1/users/mockuser/two-factor/backup',
      fixture: 'users/two-factor/backup/200.get.json',
    });
  });

  if (!IS_HIBANA_ENABLED) {
    it('turns the Hibana theme on when the user clicks on the theme toggle', () => {
      cy.visit(PAGE_URL);

      cy.stubRequest({
        url: 'api/v1/users/mockuser',
        method: 'PUT',
        fixture: 'users/200.put.update-ui-options.json',
        requestAlias: 'updateUIOptions',
      });

      cy.findByDataId('desktop-navigation').should('not.exist'); // Checks for the Hibana navigation

      // The Toggle component does not have an appropriate label - this is actually an a11y bug that will be addressed by Matchbox
      cy.get('[name="isHibanaEnabled"]').click({ force: true });
      cy.wait('@updateUIOptions').then(xhr => {
        expect(xhr.request.body).to.deep.equal({
          options: { ui: { isHibanaEnabled: true, isHibanaBannerVisible: false } },
        });
      });
      cy.findByText('App design updated.').should('be.visible');
      cy.findByDataId('desktop-navigation').should('be.visible'); // Checks for the Hibana navigation

      cy.get('[name="isHibanaEnabled"]').click({ force: true });
      cy.wait('@updateUIOptions').then(xhr => {
        expect(xhr.request.body).to.deep.equal({
          options: { ui: { isHibanaEnabled: false, isHibanaBannerVisible: false } },
        });
      });
      cy.findAllByText('App design updated.').should('be.visible'); // The previous feedback message may still be around, so need to grab all of them
      cy.findByDataId('desktop-navigation').should('not.exist');
    });
  }
});
