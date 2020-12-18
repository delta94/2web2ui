const PAGE_URL = '/alerts';
const API_URL = '/api/v1/alerts';

function stubAlerts({ fixture = 'alerts/200.get.json', statusCode } = {}) {
  return cy.stubRequest({
    url: API_URL,
    fixture,
    statusCode,
    requestAlias: 'alertsReq',
  });
}

describe('The alerts list page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  it('renders with a relevant page title', () => {
    stubAlerts();
    cy.visit(PAGE_URL);
    cy.wait('@alertsReq');

    cy.title().should('include', 'Alerts');
    cy.get('main').within(() => cy.findByRole('heading', { name: 'Alerts' }).should('be.visible'));
  });

  it('renders with a link to the create page', () => {
    stubAlerts();
    cy.visit(PAGE_URL);
    cy.wait('@alertsReq');

    cy.findByText('Create an Alert')
      .closest('a')
      .should('have.attr', 'href', '/alerts/create');
  });

  it('renders an error banner when the server returns one', () => {
    stubAlerts({ fixture: 'alerts/400.get.json', statusCode: 400 });
    cy.visit(PAGE_URL);
    cy.wait('@alertsReq');

    cy.visit(PAGE_URL);

    cy.findByText('An error occurred').should('be.visible');
    cy.findByText('Try Again').should('be.visible');
    cy.findByText('Show Error Details').click();
    cy.findByText('This is an error').should('be.visible');
    cy.get('table').should('not.exist');

    stubAlerts();
    cy.findByRole('button', { name: 'Try Again' }).click();
    cy.wait('@alertsReq');
    cy.get('table').should('be.visible');
  });

  it('renders the empty state when no results are returned', () => {
    stubAlerts({ fixture: 'alerts/200.get.no-results.json' });
    cy.visit(PAGE_URL);
    cy.wait('@alertsReq');

    cy.findAllByText('Create an Alert').should('have.length', 2);
    cy.findByText('Manage notifications that alert you of performance problems.').should(
      'be.visible',
    );
    cy.findAllByText('Create an Alert')
      .last()
      .closest('a')
      .should('have.attr', 'href', '/alerts/create');
    cy.get('table').should('not.exist');
  });

  it('renders recent incidents', () => {
    stubAlerts();
    cy.visit(PAGE_URL);
    cy.wait('@alertsReq');

    cy.findByText('Recent Incidents').should('be.visible');

    cy.get('[data-id="recent-incidents"]').within(() => {
      // 'Alert 1' and 'Alert 4' are not rendered since they are muted
      cy.findByText('Alert 1').should('not.exist');
      cy.findByText('Alert 2').should('be.visible');
      cy.findByText('Alert 3').should('be.visible');
      cy.findByText('Alert 4').should('not.exist');
    });
  });

  it('does not render recent incidents when all alerts are muted', () => {
    stubAlerts({ fixture: 'alerts/200.get.all-muted.json' });
    cy.visit(PAGE_URL);
    cy.wait('@alertsReq');

    cy.findByText('Recent Incidents').should('not.exist');
    cy.get('[data-id="recent-incidents"]').should('not.exist');
  });

  describe('the alerts table', () => {
    function assertTableRow({ rowIndex, name, metric, isMuted }) {
      cy.get('tbody tr')
        .eq(rowIndex)
        .within(() => {
          cy.findByText(name).should('be.visible');
          cy.findByText(metric).should('be.visible');
          cy.get('[data-id="alert-toggle"]').within(() =>
            cy.get('input[type="checkbox"]').should(isMuted ? 'be.checked' : 'not.be.checked'),
          );
        });
    }

    function clickDeleteButton() {
      cy.findAllByText('Delete')
        .first()
        .click({ force: true });
    }

    it('has alerts in table rows', () => {
      stubAlerts();
      cy.visit(PAGE_URL);
      cy.wait('@alertsReq');

      assertTableRow({
        rowIndex: 0,
        name: 'Alert 2',
        metric: 'Soft Bounce Rate',
        isMuted: false,
      });

      assertTableRow({
        rowIndex: 1,
        name: 'Alert 3',
        metric: 'Block Bounce Rate',
        isMuted: false,
      });

      assertTableRow({
        rowIndex: 2,
        name: 'Alert 1',
        metric: 'Block Bounce Rate',
        isMuted: true,
      });

      assertTableRow({
        rowIndex: 3,
        name: 'Alert 4',
        metric: 'Health Score',
        isMuted: true,
      });
    });

    it('filters by "Alert Name" based on user entry', () => {
      const debounceDelay = 300;
      stubAlerts();
      cy.visit(PAGE_URL);
      cy.wait('@alertsReq');

      cy.findByLabelText('Filter By')
        .clear()
        .type('Alert 1');

      /* eslint-disable-next-line */
      cy.wait(debounceDelay); // Debounce time

      cy.get('table').within(() => {
        cy.findByText('Alert 2').should('not.exist');
        cy.findByText('Alert 3').should('not.exist');
        cy.findByText('Alert 4').should('not.exist');
      });

      cy.findByLabelText('Filter By').clear();

      /* eslint-disable-next-line */
      cy.wait(debounceDelay); // Debounce time

      cy.get('table').within(() => {
        cy.findByText('Alert 1').should('be.visible');
        cy.findByText('Alert 2').should('be.visible');
        cy.findByText('Alert 3').should('be.visible');
        cy.findByText('Alert 4').should('be.visible');
      });

      cy.findByLabelText('Filter By')
        .clear()
        .type('Alert');

      /* eslint-disable-next-line */
      cy.wait(debounceDelay); // Debounce time

      cy.get('table').within(() => {
        cy.findByText('Alert 1').should('be.visible');
        cy.findByText('Alert 2').should('be.visible');
        cy.findByText('Alert 3').should('be.visible');
        cy.findByText('Alert 4').should('be.visible');
      });

      cy.findByLabelText('Filter By')
        .clear()
        .type('1');

      /* eslint-disable-next-line */
      cy.wait(debounceDelay); // Debounce time

      cy.get('table').within(() => {
        cy.findByText('Alert 2').should('not.exist');
        cy.findByText('Alert 3').should('not.exist');
        cy.findByText('Alert 4').should('not.exist');
      });
    });

    it('renders a success banner when muting an alert successfully', () => {
      stubAlerts();
      cy.visit(PAGE_URL);
      cy.wait('@alertsReq');

      cy.stubRequest({
        method: 'PUT',
        url: `${API_URL}/2`,
        fixture: 'alerts/2/200.put.json',
      });

      cy.get('tbody tr')
        .first()
        .within(() => {
          cy.get('[data-id="alert-toggle"]')
            .scrollIntoView()
            .find('input')
            .click({ force: true });
        });

      cy.findByText('Alert updated').should('be.visible');
    });

    it('renders an error when muting an alert fails', () => {
      stubAlerts();
      cy.visit(PAGE_URL);
      cy.wait('@alertsReq');

      cy.stubRequest({
        method: 'PUT',
        statusCode: 400,
        url: `${API_URL}/2`,
        fixture: 'alerts/2/400.put.json',
      });

      cy.get('tbody tr')
        .first()
        .within(() => {
          cy.get('[data-id="alert-toggle"]')
            .scrollIntoView()
            .find('input')
            .click({ force: true });
        });

      cy.findByText('Something went wrong.').should('be.visible');
      cy.findByText('View Details').click();
      cy.findByText('This is an error').should('be.visible');
    });

    it('opens a delete confirmation modal when clicking the delete button', () => {
      stubAlerts();
      cy.visit(PAGE_URL);
      cy.wait('@alertsReq');

      cy.findAllByText('Alert 2').should('have.length', 2); // Both the recent incident panel, and the table

      clickDeleteButton();

      cy.findByText('Are you sure you want to delete this alert?').should('be.visible');
      cy.withinModal(() => cy.findByText('Cancel').click());

      cy.findByText('Are you sure you want to delete this alert?').should('not.exist');

      clickDeleteButton();

      cy.stubRequest({
        method: 'DELETE',
        url: `${API_URL}/2`,
        fixture: 'alerts/2/200.delete.json',
      });

      cy.withinModal(() => cy.findByText('Delete').click());
      cy.findByText('Alert deleted').should('be.visible');
      cy.findByText('Alert 2').should('not.exist');
    });

    it('renders an error when deleting an alert fails', () => {
      stubAlerts();
      cy.visit(PAGE_URL);
      cy.wait('@alertsReq');

      clickDeleteButton();

      cy.stubRequest({
        method: 'DELETE',
        statusCode: 400,
        url: `${API_URL}/2`,
        fixture: 'alerts/2/400.delete.json',
      });

      cy.withinModal(() => cy.findByText('Delete').click());
      // Needed to fix visibility issue with Hibana Cypress test
      cy.withinModal(() => {
        cy.findByText('Cancel').click();
      });

      cy.findByText('Something went wrong.').should('be.visible');
      cy.findByText('View Details').click();
      cy.findByText('This is an error').should('be.visible');
    });
  });
});
