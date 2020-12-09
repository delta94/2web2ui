import { IS_HIBANA_ENABLED } from 'cypress/constants';
import { PAGE_URL, STABLE_UNIX_DATE } from './constants';
import { stubDeliverability, stubTimeSeries } from './helpers';

if (IS_HIBANA_ENABLED) {
  describe('Analytics Report bounce and rejection tables', () => {
    beforeEach(() => {
      cy.stubAuth();
      cy.login({ isStubbed: true });
      cy.stubRequest({
        url: '/api/v1/subaccounts',
        fixture: '/subaccounts/200.get.json',
        requestAlias: 'getSubaccounts',
      });
      stubDeliverability();
      stubTimeSeries();
      cy.visit(PAGE_URL);
      cy.findByText('Add Metrics').click();
    });

    describe('the bounce reason table', () => {
      beforeEach(() => {
        cy.withinDrawer(() => {
          // Uncheck defaults, and check a metric that renders the "Rejection Reason" table
          cy.findByLabelText('Targeted').uncheck({ force: true });
          cy.findByLabelText('Accepted').uncheck({ force: true });
          cy.findByLabelText('Bounces').uncheck({ force: true });
          cy.findByLabelText('Bounces').check({ force: true });
          cy.findByRole('button', { name: 'Apply Metrics' }).click();

          cy.wait(['@getDeliverability', '@getTimeSeries']);
        });
      });

      it('renders the report chart and bounce table depending on the selected tab', () => {
        cy.clock(STABLE_UNIX_DATE);

        cy.findByDataId('summary-chart').within(() => {
          cy.findByRole('tab', { name: 'Bounce Reason' }).click();
          cy.findByText('No bounce reasons to report').should('be.visible');
          cy.findByRole('tab', { name: 'Report' }).click();
          cy.get('.recharts-wrapper').should('be.visible');
        });
      });

      it('renders with bounce reason data', () => {
        cy.clock(STABLE_UNIX_DATE);
        stubDeliverability();
        cy.stubRequest({
          url: '/api/v1/metrics/deliverability/bounce-classification**/*',
          fixture: 'metrics/deliverability/bounce-classification/200.get.json',
          requestAlias: 'getBounceClassification',
        });
        cy.stubRequest({
          url: '/api/v1/metrics/deliverability/bounce-reason/domain**/*',
          fixture: 'metrics/deliverability/bounce-reason/domain/200.get.json',
          requestAlias: 'getBounceReason',
        });

        cy.findByRole('tab', { name: 'Bounce Reason' }).click();

        cy.wait(['@getDeliverability', '@getBounceClassification', '@getBounceReason']);

        cy.get('tbody tr').within(() => {
          cy.get('td')
            .eq(0)
            .should('have.text', '0%');

          cy.get('td')
            .eq(1)
            .should('have.text', 'Mail Block');

          cy.get('td')
            .eq(2)
            .should('have.text', 'Block');

          cy.get('td')
            .eq(3)
            .should('have.text', 'This is the bounce reason. For real.');

          cy.get('td')
            .eq(4)
            .should('have.text', 'gmail.com');
        });
      });

      it('renders an empty state when no results are returned', () => {
        cy.findByRole('tab', { name: 'Bounce Reason' }).click();

        cy.findByLabelText('Filter').should('not.be.visible');
        cy.findByText('No bounce reasons to report').should('be.visible');
      });
    });

    describe('the rejection reason table', () => {
      beforeEach(() => {
        cy.withinDrawer(() => {
          cy.findByLabelText('Targeted').uncheck({ force: true });
          cy.findByLabelText('Accepted').uncheck({ force: true });
          cy.findByLabelText('Bounces').uncheck({ force: true });
          cy.findByLabelText('Rejected').check({ force: true });
          cy.findByLabelText('Generation Rejections').check({ force: true });
          cy.findByLabelText('Generation Failures').check({ force: true });
          cy.findByLabelText('Policy Rejections').check({ force: true });
          cy.findByRole('button', { name: 'Apply Metrics' }).click();

          cy.wait(['@getDeliverability', '@getTimeSeries']);
        });
      });

      it('renders the report chart and rejected reason table depending on the selected tab', () => {
        cy.clock(STABLE_UNIX_DATE);

        cy.findByDataId('summary-chart').within(() => {
          cy.findByRole('tab', { name: 'Rejection Reason' }).click();
        });

        cy.findByDataId('summary-chart').within(() => cy.get('table').should('be.visible'));

        cy.findByDataId('summary-chart').within(() => {
          cy.findByRole('tab', { name: 'Report' }).click();
          cy.get('.recharts-wrapper').should('be.visible');
        });
      });

      it('renders with rejection reason data', () => {
        cy.clock(STABLE_UNIX_DATE);
        cy.stubRequest({
          url: '/api/v1/metrics/deliverability/rejection-reason/domain**/*',
          fixture: 'metrics/deliverability/rejection-reason/domain/200.get.json',
          requestAlias: 'getRejectionReasons',
        });
        cy.findByRole('tab', { name: 'Rejection Reason' }).click();

        cy.wait(['@getRejectionReasons', '@getDeliverability']);

        cy.findByLabelText('Filter').should('be.visible');

        cy.get('tbody tr').within(() => {
          cy.get('td')
            .eq(0)
            .should('have.text', '5');

          cy.get('td')
            .eq(1)
            .should('have.text', 'Policy Rejection');

          cy.get('td')
            .eq(2)
            .should('have.text', '550 - Connection frequency limited');

          cy.get('td')
            .eq(3)
            .should('have.text', 'gmail.com');
        });
      });

      it('renders an empty state when no results are returned', () => {
        cy.clock(STABLE_UNIX_DATE);
        cy.stubRequest({
          url: '/api/v1/metrics/deliverability/rejection-reason/domain**/*',
          fixture: 'blank.json',
          requestAlias: 'getRejectionReasons',
        });
        cy.findByRole('tab', { name: 'Rejection Reason' }).click();

        cy.wait(['@getRejectionReasons', '@getDeliverability']);

        cy.findByLabelText('Filter').should('not.be.visible');
        cy.findByText('No rejection reasons to report').should('be.visible');
      });
    });

    describe('the delay reason table', () => {
      beforeEach(() => {
        cy.withinDrawer(() => {
          cy.findByLabelText('Targeted').uncheck({ force: true });
          cy.findByLabelText('Accepted').uncheck({ force: true });
          cy.findByLabelText('Bounces').uncheck({ force: true });
          cy.findByLabelText('Delayed').check({ force: true });
          cy.findByLabelText('Delivered 1st Attempt').check({ force: true });
          cy.findByLabelText('Delivered 2+ Attempts').check({ force: true });

          cy.findByRole('button', { name: 'Apply Metrics' }).click();
          cy.wait(['@getDeliverability', '@getTimeSeries']);
        });
      });

      it('renders the report chart and delay reason table depending on the selected tab', () => {
        cy.clock(STABLE_UNIX_DATE);

        cy.findByDataId('summary-chart').within(() => {
          cy.findByText('Delay Reason').click();
        });

        cy.findByDataId('summary-chart').within(() => cy.get('table').should('be.visible'));

        cy.findByDataId('summary-chart').within(() => {
          cy.findByText('Report').click();
          cy.get('.recharts-wrapper').should('be.visible');
        });
      });

      it('renders with delay reason data', () => {
        cy.clock(STABLE_UNIX_DATE);
        cy.stubRequest({
          url: '/api/v1/metrics/deliverability/delay-reason/domain**/*',
          fixture: 'metrics/deliverability/delay-reason/domain/200.get.json',
          requestAlias: 'getDelayReasons',
        });
        cy.findByText('Delay Reason').click();

        cy.wait(['@getDelayReasons', '@getDeliverability']);

        cy.findByLabelText('Filter').should('be.visible');
        cy.get('tbody tr').within(() => {
          cy.get('td')
            .eq(0)
            .should('have.text', '10');

          cy.get('td')
            .eq(1)
            .should('have.text', '5 (< 0.01%)');

          cy.get('td')
            .eq(2)
            .should('have.text', 'A delay reason reason.');

          cy.get('td')
            .eq(3)
            .should('have.text', 'gmail.com');
        });
      });

      it('renders an empty state when no results are returned', () => {
        cy.clock(STABLE_UNIX_DATE);
        cy.stubRequest({
          url: '/api/v1/metrics/deliverability/delay-reason/domain**/*',
          fixture: 'blank.json',
          requestAlias: 'getDelayReasons',
        });
        cy.findByText('Delay Reason').click();

        cy.wait(['@getDelayReasons', '@getDeliverability']);

        cy.findByText('No delay reasons to report').should('be.visible');
      });
    });

    describe('the links table', () => {
      beforeEach(() => {
        cy.withinDrawer(() => {
          cy.findByLabelText('Targeted').uncheck({ force: true });
          cy.findByLabelText('Accepted').uncheck({ force: true });
          cy.findByLabelText('Bounces').uncheck({ force: true });
          cy.findByLabelText('Clicks').check({ force: true });
          cy.findByLabelText('Unique Clicks').check({ force: true });
          cy.findByLabelText('Click-through Rate').check({ force: true });

          cy.findByRole('button', { name: 'Apply Metrics' }).click();
          cy.wait(['@getDeliverability', '@getTimeSeries']);
        });
      });

      it('renders the report chart and links table depending on the selected tab', () => {
        cy.clock(STABLE_UNIX_DATE);

        cy.findByDataId('summary-chart').within(() => {
          cy.findByRole('tab', { name: 'Links' }).click();
        });

        cy.findByDataId('summary-chart').within(() => cy.get('table').should('be.visible'));

        cy.findByDataId('summary-chart').within(() => {
          cy.findByRole('tab', { name: 'Report' }).click();
          cy.get('.recharts-wrapper').should('be.visible');
        });
      });

      it('renders with the links table data', () => {
        cy.clock(STABLE_UNIX_DATE);
        cy.stubRequest({
          url: '/api/v1/metrics/deliverability/link-name**/*',
          fixture: 'metrics/deliverability/link-name/200.get.json',
          requestAlias: 'getLinks',
        });
        cy.findByRole('tab', { name: 'Links' }).click();

        cy.wait(['@getLinks', '@getDeliverability']);

        cy.findByLabelText('Filter').should('be.visible');
        cy.get('tbody tr')
          .eq(0)
          .within(() => {
            cy.get('td')
              .eq(0)
              .should('have.text', 'Mock Link 1');

            cy.get('td')
              .eq(1)
              .should('have.text', '10');

            cy.get('td')
              .eq(2)
              .should('have.text', '10');

            cy.get('td')
              .eq(3)
              .should('have.text', '0%');
          });

        cy.get('tbody tr')
          .eq(1)
          .within(() => {
            cy.get('td')
              .eq(0)
              .should('have.text', 'Mock Link 2');

            cy.get('td')
              .eq(1)
              .should('have.text', '20');

            cy.get('td')
              .eq(2)
              .should('have.text', '20');

            cy.get('td')
              .eq(3)
              .should('have.text', '0%');
          });

        cy.get('tbody tr')
          .eq(2)
          .within(() => {
            cy.get('td')
              .eq(0)
              .should('have.text', 'Mock Link 3');

            cy.get('td')
              .eq(1)
              .should('have.text', '30');

            cy.get('td')
              .eq(2)
              .should('have.text', '30');

            cy.get('td')
              .eq(3)
              .should('have.text', '0%');
          });

        cy.get('tbody tr')
          .eq(3)
          .within(() => {
            cy.get('td')
              .eq(0)
              .should('have.text', 'Mock Link 4');

            cy.get('td')
              .eq(1)
              .should('have.text', '40');

            cy.get('td')
              .eq(2)
              .should('have.text', '40');

            cy.get('td')
              .eq(3)
              .should('have.text', '0%');
          });
      });

      it('renders an empty state when no results are returned', () => {
        cy.clock(STABLE_UNIX_DATE);
        cy.stubRequest({
          url: '/api/v1/metrics/deliverability/link-name**/*',
          fixture: 'blank.json',
          requestAlias: 'getLinks',
        });
        cy.findByRole('tab', { name: 'Links' }).click();

        cy.wait(['@getLinks', '@getDeliverability']);

        cy.findByText('No links to report').should('be.visible');
      });
    });
  });
}
