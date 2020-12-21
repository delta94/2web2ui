import { IS_HIBANA_ENABLED } from 'cypress/constants';

const PAGE_URL = '/dashboard';
const accountDropdownSelector = '[data-id="nav-button-accounts"]';
const navigationListSelector = '[data-id="navigation-list"]';
const accountDropdownListSelector = '[data-id="account-dropdown-list"]';

function beforeSteps() {
  cy.stubAuth();
  cy.login({ isStubbed: true });
}

function openAccountMenu() {
  cy.get(accountDropdownSelector).click();
}

function assertAllSignalsAnalyticsLinks() {
  // Signals Analytics section and subitems
  cy.findByRole('button', { name: 'Signals Analytics' }).click();

  cy.verifyLink({
    content: 'Summary',
    href: '/reports/summary',
  });
  cy.verifyLink({
    content: 'Bounce',
    href: '/reports/bounce',
  });
  cy.verifyLink({
    content: 'Rejections',
    href: '/reports/rejections',
  });
  cy.verifyLink({
    content: 'Accepted',
    href: '/reports/accepted',
  });
  cy.verifyLink({
    content: 'Delayed',
    href: '/reports/delayed',
  });
  cy.verifyLink({
    content: 'Health Score',
    href: '/signals/health-score',
  });
  cy.verifyLink({
    content: 'Spam Traps',
    href: '/signals/spam-traps',
  });
  cy.verifyLink({
    content: 'Engagement Recency',
    href: '/signals/engagement',
  });
  cy.verifyLink({
    content: 'Engagement',
    href: '/reports/engagement',
  });

  cy.findByRole('button', { name: 'Signals Analytics' }).click({ force: true });
}

function stubGrantsRequest({ role }) {
  cy.stubRequest({
    url: '/api/v1/authenticate/grants*',
    fixture: `authenticate/grants/200.get.${role}.json`,
  });

  cy.visit(PAGE_URL);

  cy.wait('@stubbedAccountRequest'); // Waits stubbed account request to come through
  cy.wait('@stubbedAccountRequest'); // ...the request is made twice! So wait again for the second
}

if (!IS_HIBANA_ENABLED) {
  describe('The navigation content as an admin', () => {
    beforeEach(() => {
      beforeSteps();
      stubGrantsRequest({ role: 'admin' });
      cy.visit(PAGE_URL);
    });

    it('renders with relevant links', () => {
      cy.get(navigationListSelector).within(() => {
        cy.verifyLink({
          content: 'Dashboard',
          href: '/dashboard',
        });
        assertAllSignalsAnalyticsLinks();
        cy.verifyLink({
          content: 'Events',
          href: '/reports/message-events',
        });

        cy.findByText('Content').click();

        cy.verifyLink({
          content: 'Templates',
          href: '/templates',
        });
        cy.verifyLink({
          content: 'A/B Testing',
          href: '/ab-testing',
        });
        cy.verifyLink({
          content: 'Snippets',
          href: '/snippets',
        });

        cy.findByText('Content').click();

        cy.findByText('Recipients').click();

        cy.verifyLink({
          content: 'Recipient Validation',
          href: '/recipient-validation/list',
        });
        cy.verifyLink({
          content: 'Recipient Lists',
          href: '/lists/recipient-lists',
        });
        cy.verifyLink({
          content: 'Suppressions',
          href: '/lists/suppressions',
        });
        cy.verifyLink({
          content: 'Alerts',
          href: '/alerts',
        });

        cy.findByText('Recipients').click();

        cy.findByText('Configuration')
          .scrollIntoView()
          .click();

        cy.verifyLink({
          content: 'Webhooks',
          href: '/webhooks',
        });
        cy.verifyLink({
          content: 'IP Pools',
          href: '/account/ip-pools',
        });
        cy.verifyLink({
          content: 'API Keys',
          href: '/account/api-keys',
        });
        cy.verifyLink({
          content: 'SMTP Settings',
          href: '/account/smtp',
        });
        cy.verifyLink({
          content: 'Sending Domains',
          href: '/account/sending-domains',
        });
        cy.verifyLink({
          content: 'Tracking Domains',
          href: '/account/tracking-domains',
        });
        cy.verifyLink({
          content: 'Subaccounts',
          href: '/account/subaccounts',
        });
      });
    });

    it('renders relevant links in the account menu', () => {
      openAccountMenu();

      cy.get(accountDropdownListSelector).within(() => {
        cy.verifyLink({
          content: 'Account Settings',
          href: '/account/settings',
        });
        cy.verifyLink({
          content: 'Profile',
          href: '/account/profile',
        });
        cy.verifyLink({
          content: 'Billing',
          href: '/account/billing',
        });
        cy.verifyLink({
          content: 'Billing',
          href: '/account/billing',
        });
        cy.verifyLink({
          content: 'Manage Users',
          href: '/account/users',
        });

        cy.findByText('Get Help').should('be.visible');

        cy.verifyLink({
          content: 'API Docs',
          href: 'https://developers.sparkpost.com/api',
        });

        cy.verifyLink({
          content: 'Log Out',
          href: '/logout',
        });
      });
    });
  });

  describe('The navigation content as a templates user', () => {
    beforeEach(() => {
      beforeSteps();
      stubGrantsRequest({ role: 'templates' });
      cy.visit(PAGE_URL);
    });

    it('renders with relevant links', () => {
      cy.get(navigationListSelector).within(() => {
        cy.verifyLink({
          content: 'Dashboard',
          href: '/dashboard',
        });
        assertAllSignalsAnalyticsLinks();
      });
      cy.verifyLink({
        content: 'Events',
        href: '/reports/message-events',
      });
      cy.findByText('Content').click();

      cy.verifyLink({
        content: 'Templates',
        href: '/templates',
      });
      cy.verifyLink({
        content: 'A/B Testing',
        href: '/ab-testing',
      });
      cy.verifyLink({
        content: 'Snippets',
        href: '/snippets',
      });

      cy.findByText('Content').click();

      cy.findByText('Recipients').click();

      cy.verifyLink({
        content: 'Recipient Lists',
        href: '/lists/recipient-lists',
      });
      cy.verifyLink({
        content: 'Suppressions',
        href: '/lists/suppressions',
      });
      cy.verifyLink({
        content: 'Alerts',
        href: '/alerts',
      });
      cy.findByText('Recipients').click();
      cy.findByText('Configuration').should('not.exist');
    });

    it('renders relevant links in the account menu', () => {
      openAccountMenu();

      cy.get(accountDropdownListSelector).within(() => {
        cy.findByText('Account Settings').should('not.exist');

        cy.verifyLink({
          content: 'Profile',
          href: '/account/profile',
        });
        cy.findByText('Get Help').should('be.visible');
        cy.verifyLink({
          content: 'API Docs',
          href: 'https://developers.sparkpost.com/api',
        });
        cy.verifyLink({
          content: 'Log Out',
          href: '/logout',
        });
      });
    });
  });

  describe('The navigation content as a reporting user', () => {
    beforeEach(() => {
      beforeSteps();
      stubGrantsRequest({ role: 'reporting' });
      cy.visit(PAGE_URL);
    });

    it('renders with relevant links', () => {
      cy.get(navigationListSelector).within(() => {
        cy.verifyLink({
          content: 'Dashboard',
          href: '/dashboard',
        });
        assertAllSignalsAnalyticsLinks();
        cy.verifyLink({
          content: 'Events',
          href: '/reports/message-events',
        });
        cy.findByText('Content').click();

        cy.verifyLink({
          content: 'Templates',
          href: '/templates',
        });
        cy.verifyLink({
          content: 'Snippets',
          href: '/snippets',
        });
        cy.findByText('Content').click();
        cy.findByText('Recipients').should('not.exist');
        cy.verifyLink({
          content: 'Alerts',
          href: '/alerts',
        });
      });
    });

    it('renders relevant links in the account menu', () => {
      openAccountMenu();

      cy.get(accountDropdownListSelector).within(() => {
        cy.verifyLink({
          content: 'Profile',
          href: '/account/profile',
        });
        cy.verifyLink({
          content: 'API Docs',
          href: 'https://developers.sparkpost.com/api',
        });
        cy.verifyLink({
          content: 'Log Out',
          href: '/logout',
        });

        cy.findByText('Billing').should('not.exist');
        cy.findByText('Manage Users').should('not.exist');
        cy.findByText('Get Help').should('be.visible');
      });
    });
  });

  describe('The navigation content as a developer user', () => {
    beforeEach(() => {
      beforeSteps();
      stubGrantsRequest({ role: 'reporting' });
      cy.visit(PAGE_URL);
    });

    it('renders with relevant links', () => {
      cy.get(navigationListSelector).within(() => {
        cy.verifyLink({
          content: 'Dashboard',
          href: '/dashboard',
        });
        cy.findByText('Signals Analytics').click();

        cy.verifyLink({
          content: 'Summary',
          href: '/reports/summary',
        });
        cy.verifyLink({
          content: 'Bounce',
          href: '/reports/bounce',
        });
        cy.verifyLink({
          content: 'Rejections',
          href: '/reports/rejections',
        });
        cy.verifyLink({
          content: 'Accepted',
          href: '/reports/accepted',
        });
        cy.verifyLink({
          content: 'Delayed',
          href: '/reports/delayed',
        });
        cy.verifyLink({
          content: 'Health Score',
          href: '/signals/health-score',
        });
        cy.verifyLink({
          content: 'Spam Traps',
          href: '/signals/spam-traps',
        });
        cy.verifyLink({
          content: 'Engagement Recency',
          href: '/signals/engagement',
        });
        cy.verifyLink({
          content: 'Engagement',
          href: '/reports/engagement',
        });
        cy.verifyLink({
          content: 'Events',
          href: '/reports/message-events',
        });

        cy.findByText('Signals Analytics').click();

        cy.findByText('Content').click();

        cy.verifyLink({
          content: 'Templates',
          href: '/templates',
        });
        cy.verifyLink({
          content: 'Snippets',
          href: '/snippets',
        });

        cy.findByText('Content').click();

        cy.findByText('Recipients').should('not.exist');
        cy.verifyLink({
          content: 'Alerts',
          href: '/alerts',
        });
      });
    });

    it('renders relevant links in the account menu', () => {
      openAccountMenu();

      cy.get(accountDropdownListSelector).within(() => {
        cy.verifyLink({
          content: 'Profile',
          href: '/account/profile',
        });
        cy.verifyLink({
          content: 'API Docs',
          href: 'https://developers.sparkpost.com/api',
        });
        cy.verifyLink({
          content: 'Log Out',
          href: '/logout',
        });

        cy.findByText('Billing').should('not.exist');
        cy.findByText('Manage Users').should('not.exist');
        cy.findByText('Get Help').should('be.visible');
      });
    });
  });

  describe('The navigation content as a subaccount reporting user', () => {
    beforeEach(() => {
      beforeSteps();
      stubGrantsRequest({ role: 'subaccount-reporting' });
      cy.visit(PAGE_URL);
    });

    it('renders with relevant links', () => {
      cy.get(navigationListSelector).within(() => {
        cy.verifyLink({
          content: 'Dashboard',
          href: '/dashboard',
        });
        assertAllSignalsAnalyticsLinks();
        cy.verifyLink({
          content: 'Events',
          href: '/reports/message-events',
        });
        cy.findByText('Content').click();

        cy.verifyLink({
          content: 'Templates',
          href: '/templates',
        });
        cy.verifyLink({
          content: 'Snippets',
          href: '/snippets',
        });

        cy.findByText('Content').click();
        cy.findByText('Recipients').should('not.exist');
        cy.findByText('Alerts').should('not.exist');
        cy.findByText('Configuration').should('not.exist');
      });
    });

    it('renders relevant links in the account menu', () => {
      openAccountMenu();

      cy.get(accountDropdownListSelector).within(() => {
        cy.verifyLink({ content: 'Profile', href: '/account/profile' });
        cy.findByText('Get Help').should('be.visible');
        cy.verifyLink({ content: 'API Docs', href: 'https://developers.sparkpost.com/api' });
        cy.verifyLink({ content: 'Log Out', href: '/logout' });
      });
    });
  });

  describe('Feature-flagged navigation items', () => {
    beforeEach(() => beforeSteps());

    it('renders the "Blocklist" feature when the user\'s account has the feature enabled', () => {
      cy.stubRequest({
        url: '/api/v1/account*',
        fixture: 'account/200.get.has-blocklist-feature.json',
      });

      cy.visit(PAGE_URL);

      cy.findByText('Blocklist').should('be.visible');
    });

    it('does not render the "Blocklist" feature when the user\'s account has the feature disabled', () => {
      cy.stubRequest({
        url: '/api/v1/account*',
        fixture: 'account/200.get.does-not-have-blocklist-feature.json',
      });

      cy.visit(PAGE_URL);

      cy.findByText('Blocklist').should('not.exist');
    });

    it('renders the "Inbox Placement" feature when the user\'s account has the feature enabled', () => {
      cy.stubRequest({
        url: '/api/v1/account*',
        fixture: 'account/200.get.has-inbox-placement.json',
      });

      cy.visit(PAGE_URL);

      cy.findByText('Inbox Placement').should('be.visible');
    });

    it('does not render the "Inbox Placement" feature when the user\'s account has the feature enabled', () => {
      cy.stubRequest({
        url: '/api/v1/account*',
        fixture: 'account/200.get.does-not-have-inbox-placement.json',
      });

      cy.visit(PAGE_URL);

      cy.findByText('Inbox Placement').should('not.exist');
    });
  });

  describe('The navigation on a free plan', () => {
    beforeEach(() => beforeSteps());

    it('renders the "Upgrade Plan" link and Upgrade tag when the users is on the free plan', () => {
      cy.stubRequest({
        url: '/api/v1/account*',
        fixture: 'account/200.get.test-plan.json',
      });

      cy.visit(PAGE_URL);

      cy.get('[data-id="top-nav"]').within(() => {
        cy.verifyLink({
          content: 'Upgrade Plan',
          href: '/account/billing/plan',
        });
      });

      openAccountMenu();

      cy.get(accountDropdownListSelector).within(() => {
        cy.findByText('Billing').should('be.visible');
        cy.findByText('Upgrade').should('be.visible');
      });
    });
  });
}
