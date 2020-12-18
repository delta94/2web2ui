const SUBACCOUNT_ID = '102';
const PAGE_URL = `/signals/engagement/cohorts/sid/${SUBACCOUNT_ID}`;
const SPAM_HITS_API_URL = '/api/v1/signals/spam-hits/**/*';
const HEALTH_SCORE_API_URL = '/api/v1/signals/health-score/**/*';
const COHORT_ENGAGEMENT_API_URL = '/api/v1/signals/cohort-engagement/**/*';
const STABLE_UNIX_DATE = 1581087062000; // Stable unix timestamp (2/6/2020)

function stubEmptyState() {
  cy.stubRequest({
    url: SPAM_HITS_API_URL,
    fixture: 'signals/spam-hits/200.get.no-results.json',
    requestAlias: 'spamHitsRequest',
  });

  cy.stubRequest({
    url: HEALTH_SCORE_API_URL,
    fixture: 'signals/health-score/200.get.no-results.json',
    requestAlias: 'healthScoreRequest',
  });

  cy.stubRequest({
    url: COHORT_ENGAGEMENT_API_URL,
    fixture: 'signals/cohort-engagement/200.get.no-results.json',
    requestAlias: 'cohortEngagementRequest',
  });
}

describe('The engagement details page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });

    cy.stubRequest({
      url: SPAM_HITS_API_URL,
      fixture: 'signals/spam-hits/200.get.json',
      requestAlias: 'spamHitsRequest',
    });

    cy.stubRequest({
      url: HEALTH_SCORE_API_URL,
      fixture: 'signals/health-score/200.get.json',
      requestAlias: 'healthScoreRequest',
    });

    cy.stubRequest({
      url: COHORT_ENGAGEMENT_API_URL,
      fixture: 'signals/cohort-engagement/200.get.json',
      requestAlias: 'cohortEngagementRequest',
    });
  });

  it('has a relevant page title', () => {
    cy.visit(PAGE_URL);

    cy.title().should('include', 'Engagement Details | Engagement Recency | Signals Analytics');
    cy.withinMainContent(() => cy.findByText('Engagement Recency').should('be.visible'));
  });

  it('renders with a link back to the dashboard page', () => {
    cy.visit(PAGE_URL);

    cy.verifyLink({
      content: 'Back to Engagement Recency Overview',
      href: '/signals/engagement',
    });
  });

  it('renders the empty state when no results are returned', () => {
    stubEmptyState();
    cy.visit(PAGE_URL);

    cy.findByText('Recommendations').should('not.exist');
    cy.findByText('Insufficient data to populate this chart').should('be.visible');
  });

  it('renders with the current Subaccount ID', () => {
    cy.visit(PAGE_URL);

    cy.findByText('Subaccount 102').should('be.visible');
  });

  it('re-requests data when filtering by date', () => {
    cy.visit(PAGE_URL);
    stubEmptyState();

    cy.findByLabelText('Broad Date Range').select('Last 7 Days');

    cy.findByText('Insufficient data to populate this chart').should('be.visible');
  });

  describe('engagement data breakdown within tabs', () => {
    beforeEach(() => cy.clock(STABLE_UNIX_DATE));

    describe('the "Cohorts" tab', () => {
      const cohortsChartSelector = '[data-id="engagement-recency-cohorts-chart"]';

      it('renders a chart when clicked that renders a tooltip when clicked', () => {
        cy.visit(PAGE_URL);

        cy.get(cohortsChartSelector).within(() => {
          cy.findByText('New').should('be.visible');
          cy.findByText('Never Engaged').should('be.visible');
          cy.findByText('Not Recently Engaged').should('be.visible');
          cy.findByText('Semi Recently Engaged').should('be.visible');
          cy.findByText('Recently Engaged').should('be.visible');

          cy.get('.recharts-rectangle')
            .last()
            .click();

          // Not checking for *all* data in the tooltip, just checking that it is
          // showing properly. Ideally, unit tests can help check for this behavior.
          // Checking for visibility isn't quite working due to how Recharts
          // implemented the tooltip, so checking for existence will have to do.
          cy.findByText('Never engaged, first email in last 7 days').should('exist');
        });
      });

      it('renders an empty state when no data is available', () => {
        cy.stubRequest({
          url: COHORT_ENGAGEMENT_API_URL,
          fixture: 'signals/cohort-engagement/200.get.no-results.json',
          requestAlias: 'cohortEngagementRequest',
        });

        cy.visit(PAGE_URL);

        cy.get(cohortsChartSelector).within(() => {
          cy.findByText('Insufficient data to populate this chart').should('be.visible');
        });

        cy.findByText('Recommendations').should('not.exist');
      });

      it('renders recommendations based on the returned data', () => {
        cy.visit(PAGE_URL);

        cy.findByText('Recommendations – Feb 6 2020').should('be.visible');
        cy.findByText('A large number of new recipients have yet to engage.').should('be.visible');
        cy.findByText(
          'This lack of engagement will have a negative impact on your reputation with mailbox providers. To reduce this, improve your email content and reevaluate your list acquisition practices.',
        ).should('be.visible');
      });

      it('renders an error when the server returns one', () => {
        cy.stubRequest({
          statusCode: 400,
          url: COHORT_ENGAGEMENT_API_URL,
          fixture: 'signals/cohort-engagement/400.get.json',
        });

        cy.visit(PAGE_URL);

        cy.get(cohortsChartSelector).within(() => {
          cy.findByText('Unable to Load Data').should('be.visible');
        });
      });
    });

    describe('the "Engagement Rate" tab', () => {
      const engagementRateChartSelector = '[data-id="engagement-rate-chart"]';
      const apiRoute = '/api/v1/signals/eng-cohort/**/*';
      const tabRoute = `/signals/engagement/engagement-rate/sid/${SUBACCOUNT_ID}`;

      it('renders a chart when clicked that renders a tooltip when clicked', () => {
        cy.stubRequest({
          url: apiRoute,
          fixture: 'signals/eng-cohort/200.get.json',
        });

        cy.visit(tabRoute);

        cy.get(engagementRateChartSelector).within(() => {
          // `.findAll` used due to presence of tooltip that isn't properly hidden
          // in the DOM from Cypress. Use of `visibility: hidden;` would be recommended
          // or dynamically rendering the component instead of show/hide
          cy.findAllByText('New').should('be.visible');
          cy.findAllByText('Never Engaged').should('be.visible');
          cy.findAllByText('Not Recently Engaged').should('be.visible');
          cy.findAllByText('Semi Recently Engaged').should('be.visible');
          cy.findAllByText('Recently Engaged').should('be.visible');
          cy.get('.recharts-dot')
            .last()
            .click({ force: true }); // Overlapped by line chart, so `force` is necessary

          // Not checking for *all* data in the tooltip, just checking that it is
          // showing properly. Ideally, unit tests can help check for this behavior.
          // Checking for visibility isn't quite working due to how Recharts
          // implemented the tooltip, so checking for existence will have to do.
          cy.findByText('Never engaged, first email in last 7 days').should('exist');
        });
      });

      it('renders an empty state when no data is available', () => {
        cy.stubRequest({
          url: apiRoute,
          fixture: 'signals/eng-cohort/200.get.no-results.json',
        });

        cy.visit(tabRoute);

        cy.get(engagementRateChartSelector).within(() => {
          cy.findByText('Insufficient data to populate this chart').should('be.visible');
        });
      });

      it('renders recommendations based on the returned data', () => {
        cy.stubRequest({
          url: apiRoute,
          fixture: 'signals/eng-cohort/200.get.json',
        });

        cy.visit(tabRoute);

        cy.findByText('Recommendations – Feb 4 2020').should('be.visible');
        cy.findByText(
          'An overall low engagement rate may indicate you emails are being sent to the spam folder. Drill into your Health Score to find the issue.',
        ).should('be.visible');
      });

      it('renders an error when the server returns one', () => {
        cy.stubRequest({
          statusCode: 400,
          url: apiRoute,
          fixture: 'signals/eng-cohort/400.get.json',
        });

        cy.visit(tabRoute);

        cy.get(engagementRateChartSelector).within(() => {
          cy.findByText('Unable to Load Data').should('be.visible');
        });
      });
    });

    describe('the "Unsubscribe Rate" tab', () => {
      const unsubscribeRateChartSelector = '[data-id="unsubscribe-rate-chart"]';
      const apiRoute = '/api/v1/signals/unsub-cohort/**/*';
      const tabRoute = `/signals/engagement/unsubscribes/sid/${SUBACCOUNT_ID}`;

      it('renders a chart when clicked that renders a tooltip when clicked', () => {
        cy.stubRequest({
          url: apiRoute,
          fixture: 'signals/unsub-cohort/200.get.json',
        });

        cy.visit(tabRoute);

        cy.get(unsubscribeRateChartSelector).within(() => {
          // `.findAll` used due to presence of tooltip that isn't properly hidden
          // in the DOM from Cypress. Use of `visibility: hidden;` would be recommended
          // or dynamically rendering the component instead of show/hide
          cy.findAllByText('New').should('be.visible');
          cy.findAllByText('Never Engaged').should('be.visible');
          cy.findAllByText('Not Recently Engaged').should('be.visible');
          cy.findAllByText('Semi Recently Engaged').should('be.visible');
          cy.findAllByText('Recently Engaged').should('be.visible');

          cy.get('.recharts-dot')
            .last()
            .click({ force: true });

          // Not checking for *all* data in the tooltip, just checking that it is
          // showing properly. Ideally, unit tests can help check for this behavior.
          // Checking for visibility isn't quite working due to how Recharts
          // implemented the tooltip, so checking for existence will have to do.
          cy.findByText('Never engaged, first email in last 7 days').should('exist');
        });
      });

      it('renders an empty state when no data is available', () => {
        cy.stubRequest({
          url: apiRoute,
          fixture: 'signals/unsub-cohort/200.get.no-results.json',
        });

        cy.visit(tabRoute);

        cy.get(unsubscribeRateChartSelector).within(() => {
          cy.findByText('Insufficient data to populate this chart').should('be.visible');
        });
      });

      it('renders recommendations based on the returned data', () => {
        cy.stubRequest({
          url: apiRoute,
          fixture: 'signals/unsub-cohort/200.get.json',
        });

        cy.visit(tabRoute);

        cy.findByText('Recommendations – Feb 4 2020').should('be.visible');
        cy.findByText("Doesn't look like you have any unsubscribe issues. Great job!").should(
          'be.visible',
        );
      });

      it('renders an error when the server returns one', () => {
        cy.stubRequest({
          statusCode: 400,
          url: apiRoute,
          fixture: 'signals/unsub-cohort/400.get.json',
        });

        cy.visit(tabRoute);

        cy.get(unsubscribeRateChartSelector).within(() => {
          cy.findByText('Unable to Load Data').should('be.visible');
        });
      });
    });

    describe('the "Complaint Rate" tab', () => {
      const complaintRateChartsSelector = '[data-id="complaint-rate-chart"]';
      const apiRoute = '/api/v1/signals/fbl-cohort/**/*';
      const tabRoute = `/signals/engagement/complaints/sid/${SUBACCOUNT_ID}`;

      beforeEach(() => cy.clock(STABLE_UNIX_DATE));

      it('renders a chart when clicked that renders a tooltip when clicked', () => {
        cy.stubRequest({
          url: apiRoute,
          fixture: 'signals/fbl-cohort/200.get.json',
        });

        cy.visit(tabRoute);

        cy.get(complaintRateChartsSelector).within(() => {
          // `.findAll` used due to presence of tooltip that isn't properly hidden
          // in the DOM from Cypress. Use of `visibility: hidden;` would be recommended
          // or dynamically rendering the component instead of show/hide
          cy.findAllByText('New').should('be.visible');
          cy.findAllByText('Never Engaged').should('be.visible');
          cy.findAllByText('Not Recently Engaged').should('be.visible');
          cy.findAllByText('Semi Recently Engaged').should('be.visible');
          cy.findAllByText('Recently Engaged').should('be.visible');

          cy.get('.recharts-dot')
            .last()
            .click({ force: true });

          // Not checking for *all* data in the tooltip, just checking that it is
          // showing properly. Ideally, unit tests can help check for this behavior.
          // Checking for visibility isn't quite working due to how Recharts
          // implemented the tooltip, so checking for existence will have to do.
          cy.findByText('Never engaged, first email in last 7 days').should('exist');
        });
      });

      it('renders an empty state when no data is available', () => {
        cy.stubRequest({
          url: apiRoute,
          fixture: 'signals/fbl-cohort/200.get.no-results.json',
        });

        cy.visit(tabRoute);

        cy.get(complaintRateChartsSelector).within(() => {
          cy.findByText('Insufficient data to populate this chart').should('be.visible');
        });
      });

      it('renders recommendations based on the returned data', () => {
        cy.stubRequest({
          url: apiRoute,
          fixture: 'signals/fbl-cohort/200.get.json',
        });

        cy.visit(tabRoute);

        cy.findByText('Recommendations – Feb 4 2020').should('be.visible');
        cy.findByText('Your complaint rates are low across the board. Great job!').should(
          'be.visible',
        );
      });

      it('renders an error when the server returns one', () => {
        cy.stubRequest({
          statusCode: 400,
          url: apiRoute,
          fixture: 'signals/fbl-cohort/400.get.json',
        });

        cy.visit(tabRoute);

        cy.get(complaintRateChartsSelector).within(() => {
          cy.findByText('Unable to Load Data').should('be.visible');
        });
      });
    });
  });
});
