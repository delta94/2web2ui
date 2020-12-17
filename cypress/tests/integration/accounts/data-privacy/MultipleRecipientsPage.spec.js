import { USERNAME } from 'cypress/constants';

describe('The multi recipients data-privacy page', () => {
  const visitAsAdmin = () => {
    cy.stubAuth();
    cy.login({ isStubbed: true });

    // todo, use a factory here instead of needing to call visit again
    cy.stubRequest({
      url: `/api/v1/users/${USERNAME}`,
      fixture: 'users/200.get.no-subaccounts.json',
    });

    cy.visit('/account/data-privacy/multiple-recipients');
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
    const exampleCSV = 'data-privacy/fake-list.csv';

    cy.fixture(exampleCSV).then(fileContent => {
      cy.get('[name="file"]').upload({
        fileContent,
        fileName: 'example.csv',
        mimeType: 'text/csv',
      });
    });
    cy.findByText('Submit Request').click();

    cy.wait('@postRightToBeForgotten').then(xhrs => {
      // eslint-disable-next-line jest/valid-expect
      expect(xhrs.request.body).to.deep.equal({
        recipients: ['recipient@example.com', 'recipient2@example.com'],
        include_subaccounts: false,
      });
    });
    cy.findAllByText('Request Saved').should('be.visible');
  });

  it('renders error modal when list is invalid', () => {
    cy.stubRequest({
      method: 'POST',
      statusCode: 400,
      url: '/api/v1/data-privacy/rtbf-request',
      fixture: 'data-privacy/400.post.invalid-list.json',
    });

    visitAsAdmin();

    const exampleCSV = 'data-privacy/fake-list.csv';
    cy.get('[value="rtbf"]').check({ force: true });
    cy.fixture(exampleCSV).then(fileContent => {
      cy.get('[name="file"]').upload({
        fileContent,
        fileName: 'example.csv',
        mimeType: 'text/csv',
      });
    });
    cy.findByText('Submit Request').click();
    cy.findAllByText('Upload Error').should('be.visible');
    cy.findByText('Download List').click();
    cy.findAllByText('Upload Error').should('not.be.visible');
  });

  describe('with subaccounts', () => {
    const visitAsAdminWithSubaccounts = () => {
      cy.stubAuth();
      cy.login({ isStubbed: true });
      cy.visit('/account/data-privacy/multiple-recipients');
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
      const exampleCSV = 'data-privacy/fake-list.csv';

      cy.fixture(exampleCSV).then(fileContent => {
        cy.get('[name="file"]').upload({
          fileContent,
          fileName: 'example.csv',
          mimeType: 'text/csv',
        });
      });
      cy.findByText('Submit Request').click();

      cy.wait('@postRightToBeForgotten').then(xhrs => {
        // eslint-disable-next-line jest/valid-expect
        expect(xhrs.request.body).to.deep.equal({
          recipients: ['recipient@example.com', 'recipient2@example.com'],
          include_subaccounts: true,
        });
      });
      cy.findAllByText('Request Saved').should('be.visible');
    });
  });
});
