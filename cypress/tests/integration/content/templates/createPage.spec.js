import { TEMPLATE_ID } from './constants';
const PAGE_URL = '/templates/create';

function submitForm() {
  cy.findByLabelText('Template Name').type('Stubbed Template 1');
  cy.findByLabelText('Template ID').should('have.value', 'stubbed-template-1');
  cy.findByLabelText('Subject').type('This is a subject');
  cy.findByLabelText('From Email').type('hello@');
  cy.findByText('hello@bounce.uat.sparkspam.com').click();
  cy.findByLabelText('From Email')
    .should('have.value', 'hello@bounce.uat.sparkspam.com')
    .blur();

  cy.findByRole('button', { name: 'Create and View' }).click();
}

describe('The create template page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  it('has a relevant page title', () => {
    cy.visit(PAGE_URL);

    cy.title().should('include', 'Create Template');
    cy.findByRole('heading', { name: 'Create Template' }).should('be.visible');
  });

  it('has a link back to the templates list page', () => {
    cy.visit(PAGE_URL);

    cy.verifyLink({
      content: 'View All Templates',
      href: '/templates',
    });
  });

  it('renders the "Subaccount" field with selectable subaccounts when the user selects "Assign to Subaccount"', () => {
    cy.stubRequest({
      url: '/api/v1/subaccounts',
      fixture: 'subaccounts/200.get.json',
    });

    cy.visit(PAGE_URL);

    cy.findByLabelText('Subaccount').should('not.exist');

    // Element is covered by a presentational element, thus requiring the force option to work
    cy.findByLabelText('Assign to Subaccount').check({ force: true });

    cy.findByLabelText('Subaccount').focus();

    cy.findByText('Fake Subaccount 1').should('be.visible');
    cy.findByText('Fake Subaccount 2').should('be.visible');
    cy.findByText('Fake Subaccount 3')
      .should('be.visible')
      .click();

    cy.findByLabelText('Subaccount').should('have.value', 'Fake Subaccount 3 (103)');

    cy.findByText('Clear').click();

    cy.findByLabelText('Subaccount').should('have.value', '');
  });

  it('renders errors on each field that is skipped', () => {
    cy.visit(PAGE_URL);

    cy.findByLabelText('Template Name')
      .clear()
      .focus()
      .blur();

    cy.findByLabelText('Template ID')
      .clear()
      .focus()
      .blur();

    cy.findByLabelText('Subject')
      .clear()
      .focus()
      .blur();

    cy.findByLabelText('From Email')
      .clear()
      .focus()
      .blur();

    cy.findAllByText('Required').should('have.length', 4);
  });

  it('has a disabled "Create and View" button when relevant form fields have not been filled', () => {
    cy.visit(PAGE_URL);

    cy.findByRole('button', { name: 'Create and View' }).should('be.disabled');
  });

  it('has a "Cancel" button that links back to the templates list page', () => {
    cy.visit(PAGE_URL);

    cy.verifyLink({
      content: 'Cancel',
      href: '/templates',
    });
  });

  it('creates a new template and redirects to the edit draft page on creation', () => {
    cy.stubRequest({
      method: 'POST',
      url: '/api/v1/templates',
      fixture: 'templates/200.post.json',
    });

    cy.stubRequest({
      url: '/api/v1/templates/stubbed-template-1',
      fixture: 'templates/stubbed-template-1/200.get.json',
    });

    cy.stubRequest({
      method: 'POST',
      url: '/api/v1/utils/content-previewer',
      fixture: 'utils/content-previewer/200.post.json',
    });

    cy.stubRequest({
      url: '/api/v1/subaccounts',
      fixture: 'subaccounts/200.get.json',
    });

    cy.visit(PAGE_URL);

    submitForm();

    cy.findByText('Template Created.').should('be.visible');
    cy.url().should('include', '/edit');
    cy.findByText('Stubbed Template 1 (DRAFT)').should('be.visible');
  });

  it('renders an error when template creation fails', () => {
    cy.stubRequest({
      method: 'POST',
      statusCode: 400,
      url: '/api/v1/templates',
      fixture: 'templates/400.post.json',
    });

    cy.visit(PAGE_URL);

    submitForm();

    cy.findByText('Something went wrong.').should('be.visible');
    cy.url().should('include', 'create');
  });

  // This test was created to reproduce bug defined in TR-2938
  // Though it starts with the create page, it actually proceeds through the edit draft and edit published pages.
  it('create a new template, redirects to the edit draft page, and allows the user to publish and then duplicate the new template', () => {
    cy.visit(PAGE_URL);

    cy.findByLabelText('Template Name').type('Stubbed Template 1');
    cy.findByLabelText('From Email').type('hello@');
    cy.findByRole('option', { name: 'hello@bounce.uat.sparkspam.com' }).click();
    cy.findByLabelText('Subject').type('My Email Subject');

    cy.stubRequest({
      method: 'POST',
      url: '/api/v1/templates',
      fixture: 'templates/200.post.json',
      requestAlias: 'createTemplate',
    });

    cy.stubRequest({
      url: `/api/v1/templates/${TEMPLATE_ID}`,
      fixture: `templates/${TEMPLATE_ID}/200.get.json`,
      requestAlias: 'getTemplate',
    });

    cy.stubRequest({
      method: 'POST',
      url: '/api/v1/utils/content-previewer',
      fixture: 'utils/content-previewer/200.post.json',
      requestAlias: 'getPreview',
    });

    cy.stubRequest({
      url: '/api/v1/subaccounts',
      fixture: 'subaccounts/200.get.json',
      requestAlias: 'getSubaccounts',
    });

    cy.findByRole('button', { name: 'Create and View' }).click();
    cy.wait('@createTemplate');
    cy.wait(['@getTemplate', '@getPreview', '@getSubaccounts']);

    cy.stubRequest({
      method: 'PUT',
      url: `/api/v1/templates/${TEMPLATE_ID}`,
      fixture: 'templates/stubbed-template-1/200.put.json',
      requestAlias: 'publishTemplate',
    });

    cy.stubRequest({
      url: `/api/v1/templates/${TEMPLATE_ID}?draft=false`,
      fixture: 'templates/stubbed-template-1/200.get.published.json',
      requestAlias: 'getPublishedTemplate',
    });

    cy.findByRole('button', { name: 'Save and Publish' }).click();
    cy.withinModal(() => {
      cy.findByRole('button', { name: 'Save and Publish' }).click();
    });
    cy.findByRole('button', { name: 'Open Menu' }).click();
    cy.findByRole('button', { name: 'Duplicate' }).click();
    cy.withinModal(() => {
      cy.findByLabelText(/Template Name/g).should('have.value', 'Stubbed Template 1 (COPY)');
      cy.findByLabelText(/Template ID/g).should('have.value', `${TEMPLATE_ID}-copy`);
    });
  });
});
