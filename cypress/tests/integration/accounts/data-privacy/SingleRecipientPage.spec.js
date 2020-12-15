import { USERNAME } from 'cypress/constants';

describe('The single recipient data-privacy page', () => {
  const visitAsAdmin = () => {
    cy.stubAuth();
    cy.login({ isStubbed: true });

    // todo, use a factory here instead of needing to call visit again
    cy.stubRequest({
      url: `/api/v1/users/${USERNAME}`,
      fixture: 'users/200.get.no-subaccounts.json',
    });

    cy.visit('/account/data-privacy/single-recipient');
  };

  it('renders with a relevant page title', () => {
    visitAsAdmin();
    cy.title().should('include', 'Data and Privacy');
  });

  it('displays validation errors', () => {
    visitAsAdmin();
    cy.findByText('Submit Request').click();
    cy.findAllByText('Required').should('have.length', 2);
  });

  it('renders a success snackbar when request is submitted correctly', () => {
    cy.stubRequest({
      method: 'POST',
      url: '/api/v1/data-privacy/rtbf-request',
      fixture: 'data-privacy/200.post.json',
      requestAlias: 'postRightToBeForgotten',
    });

    visitAsAdmin();

    cy.get('[value="rtbf"]').check({ force: true });
    cy.findByLabelText('Recipient Email Address').type('myfakeusername@sparkpost.com');
    cy.findByText('Submit Request').click();

    cy.wait('@postRightToBeForgotten').then(xhrs => {
      // eslint-disable-next-line jest/valid-expect
      expect(xhrs.request.body).to.deep.equal({
        recipients: ['myfakeusername@sparkpost.com'],
        include_subaccounts: false,
      });
    });

    cy.findAllByText('Request Saved').should('be.visible');
  });

  it('renders a error snackbar when request is not submitted correctly', () => {
    cy.stubRequest({
      method: 'POST',
      statusCode: 400,
      url: '/api/v1/data-privacy/rtbf-request',
      fixture: 'data-privacy/400.post.json',
    });

    visitAsAdmin();

    cy.get('[value="rtbf"]').check({ force: true });
    cy.findByLabelText('Recipient Email Address').type('myfakeusername@sparkpost.com');
    cy.findByText('Submit Request').click();
    cy.findAllByText('Something went wrong.').should('be.visible');
  });

  describe('with subaccounts', () => {
    const visitAsAdminWithSubaccounts = () => {
      cy.stubAuth();
      cy.login({ isStubbed: true });
      cy.visit('/account/data-privacy/single-recipient');
    };

    it('renders a success snackbar when request is submitted correctly', () => {
      cy.stubRequest({
        method: 'POST',
        url: '/api/v1/data-privacy/rtbf-request',
        fixture: 'data-privacy/200.post.json',
        requestAlias: 'postRightToBeForgotten',
      });

      visitAsAdminWithSubaccounts();

      cy.get('[value="rtbf"]').check({ force: true });
      cy.get('[name="assignTo"][value="shared"]').check({ force: true });
      cy.findByLabelText('Recipient Email Address').type('myfakeusername@sparkpost.com');
      cy.findByText('Submit Request').click();

      cy.wait('@postRightToBeForgotten').then(xhrs => {
        // eslint-disable-next-line jest/valid-expect
        expect(xhrs.request.body).to.deep.equal({
          recipients: ['myfakeusername@sparkpost.com'],
          include_subaccounts: true,
        });
      });

      cy.findAllByText('Request Saved').should('be.visible');
    });
  });
});
