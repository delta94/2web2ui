const PAGE_URL = '/account/billing/plan';

describe('Change Billing Plan Page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });

    cy.stubRequest({
      url: '/api/v1/account/countries?filter=billing',
      fixture: 'account/countries/200.get.billing-filter.json',
    });

    cy.stubRequest({
      url: '/api/v1/billing/bundles**',
      fixture: 'billing/bundles/200.get.json',
      fixtureAlias: 'bundlesGet',
    });

    cy.stubRequest({
      url: '/api/v1/billing/plans',
      fixture: 'billing/plans/200.get.json',
      fixtureAlias: 'billingPlansGet',
    });
  });

  const mockCommonHttpCalls = () => {
    cy.stubRequest({
      method: 'POST',
      url: '/api/v1/billing/cors-data?context=create-account',
      fixture: 'billing/cors-data/200.post.json',
    });
    cy.stubRequest({
      method: 'POST',
      url: '/v1/accounts',
      fixture: 'zuora/accounts/200.post.json',
    });
    cy.stubRequest({
      method: 'POST',
      url: '/api/v1/account/subscription/check',
      fixture: 'account/subscription/check/200.post.json',
    });
    cy.stubRequest({
      method: 'POST',
      url: '/api/v1/billing/subscription/check',
      fixture: 'billing/subscription/check/200.post.json',
    });
    cy.stubRequest({
      url: '/api/v1/sending-ips',
      fixture: 'blank.json',
    });
    cy.stubRequest({
      url: '/api/v1/billing/invoices',
      fixture: 'blank.json',
    });
    cy.stubRequest({
      url: '/api/v1/usage',
      fixture: 'blank.json',
    });
  };

  const fillOutCreditCardForm = () => {
    cy.findByLabelText('Credit Card Number').type('4000 0000 0000 0000');
    cy.findByLabelText('Cardholder Name').type('Test Account');
    cy.findByLabelText('Expiration Date').type('03/33');
    cy.findByLabelText('Security Code').type('123');
    cy.findByLabelText('Country').select('United States');
    cy.findByLabelText('State').select('Maryland');
    cy.findByLabelText('Zip Code').type('12345');
  };

  const selectAFreePlan = () => {
    cy.stubRequest({
      url: '/api/v1/billing/subscription',
      fixture: 'billing/subscription/200.get.json',
      fixtureAlias: 'subscriptionGet',
    });
    cy.visit(PAGE_URL);
    cy.get('[data-id=select-plan-free500-0419]').click();
  };

  it('Upgrades free account to starter 50K', () => {
    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.test-plan.json',
    });
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.has-no-credit-card.json',
      fixtureAlias: 'billingGet',
    });
    cy.stubRequest({
      url: '/api/v1/billing/subscription',
      fixture: 'billing/subscription/200.get.test-plan.json',
      requestAlias: 'subscriptionGet',
    });

    // they visit the billing page and change to the starter 50k plan
    cy.visit(PAGE_URL);
    cy.get('[data-id=select-plan-50K-starter-0519]').click();

    cy.findByText(/Your features have been updated/g)
      .scrollIntoView()
      .should('be.visible');

    cy.findByText('Change Plan').click();
    cy.findAllByText('Required').should('have.length', 5);
    fillOutCreditCardForm();
    cy.findAllByText('Required').should('not.exist');

    mockCommonHttpCalls();

    // Then server returns the new plan info that was saved...
    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.json',
    });

    cy.findByText('Change Plan').click();
    cy.withinSnackbar(() => {
      cy.findByText('Subscription Updated').should('be.visible');
    });
    cy.findByText('Plan Overview').should('be.visible');
    cy.findByText('Your Plan').should('be.visible');
    cy.findByText('50,000 emails for $20 per month').should('be.visible');
    cy.url().should('equal', `${Cypress.config().baseUrl}/account/billing`);
  });

  it('Upgrades free account to starter 100K', () => {
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.has-no-credit-card.json',
      fixtureAlias: 'billingGet',
    });
    cy.stubRequest({
      url: '/api/v1/billing/subscription',
      fixture: 'billing/subscription/200.get.test-plan.json',
    });

    cy.visit(PAGE_URL);

    cy.findAllByText('100,000').should('be.visible');
    cy.findAllByText('emails/month').should('be.visible');
    cy.findAllByText('$20').should('be.visible');

    cy.get('[data-id=select-plan-100K-starter-0519]').click();

    fillOutCreditCardForm();

    mockCommonHttpCalls();

    // Then server returns the new plan info that was saved...
    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.100k-starter-plan.json',
    });

    cy.findByText('Change Plan').click();
    cy.withinSnackbar(() => {
      cy.findByText('Subscription Updated').should('be.visible');
    });
    cy.findByText('Plan Overview').should('be.visible');
    cy.findByText('Your Plan').should('be.visible');
    cy.findByText('100,000 emails for $30 per month').should('be.visible');
    cy.url().should('equal', `${Cypress.config().baseUrl}/account/billing`);
  });

  it('Upgrades free account to starter 100K with previous active subaccounts, current quantity of subaccounts exceeds new limit', () => {
    // user is on the test plan
    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.test-plan.json',
    });
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.has-no-credit-card.json',
      fixtureAlias: 'billingGet',
    });
    cy.stubRequest({
      url: '/api/v1/billing/subscription',
      fixture: 'billing/subscription/200.get.test-plan-with-subaccounts.json',
    });

    cy.visit('/account/billing/plan');

    cy.findAllByText('100,000').should('be.visible');
    cy.findAllByText('emails/month').should('be.visible');
    cy.findAllByText('$20').should('be.visible');

    cy.get('[data-id=select-plan-100K-starter-0519]').click();

    cy.findByText("Your new plan doesn't include subaccounts.").should('be.visible');
    cy.verifyLink({
      content: 'Update Status',
      href: '/account/subaccounts',
    });
    cy.findByRole('button', { name: 'Change Plan' }).should('be.disabled');
  });

  it('Upgrades free account to starter 100K, but saved reports is over the new limit', () => {
    // user is on the test plan
    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.test-plan.json',
    });
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.has-no-credit-card.json',
      fixtureAlias: 'billingGet',
    });
    cy.stubRequest({
      url: '/api/v1/billing/subscription',
      fixture: 'billing/subscription/200.get.test-plan-with-reports.json',
    });

    cy.visit('/account/billing/plan');

    cy.findAllByText('100,000').should('be.visible');
    cy.findAllByText('emails/month').should('be.visible');
    cy.findAllByText('$20').should('be.visible');

    cy.get('[data-id=select-plan-100K-starter-0519]').click();

    cy.findByText(/Your new plan only allows for 30 saved reports*./).should('be.visible');
    cy.findByText('delete 50 saved reports').should('be.visible');
    cy.verifyLink({
      content: 'Update Status',
      href: '/reports/summary',
    });
    cy.findByRole('button', { name: 'Change Plan' }).should('be.disabled');
  });

  it('Upgrades free account to starter 50K with query parameter', () => {
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.has-no-credit-card.json',
      fixtureAlias: 'billingGet',
    });
    cy.stubRequest({
      url: '/api/v1/billing/subscription',
      fixture: 'billing/subscription/200.get.test-plan.json',
    });
    cy.visit(`${PAGE_URL}?code=50K-starter-0519`);

    // auto select new plan
    cy.findByText('Your New Plan').should('be.visible');
    cy.findByText('50,000').should('be.visible');

    cy.findByText('Your features have been updated').should('be.visible');

    fillOutCreditCardForm();

    mockCommonHttpCalls();

    // Then server returns the new plan info that was saved...
    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.json',
    });

    cy.findAllByText('Change Plan').click();
    cy.withinSnackbar(() => {
      cy.findByText('Subscription Updated').should('be.visible');
    });
    cy.findByText('Plan Overview').should('be.visible');
    cy.findByText('Your Plan').should('be.visible');
    cy.findByText('50,000 emails for $20 per month').should('be.visible');
    cy.url().should('equal', `${Cypress.config().baseUrl}/account/billing`);
  });

  it('Upgrades free account to starter 100K with query parameter', () => {
    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.test-plan.json',
    });
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.has-no-credit-card.json',
      fixtureAlias: 'billingGet',
    });
    cy.stubRequest({
      url: '/api/v1/billing/subscription',
      fixture: 'billing/subscription/200.get.test-plan.json',
    });

    cy.visit(`${PAGE_URL}?code=100K-starter-0519`);

    cy.findByText('Your New Plan').should('be.visible');
    cy.findByText('100,000').should('be.visible');

    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.100k-premier-plan.json',
    });

    mockCommonHttpCalls();

    // Then server returns the new plan info that was saved...
    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.100k-starter-plan.json',
    });

    cy.findByText('Your features have been updated').should('be.visible');

    fillOutCreditCardForm();

    cy.findByText('Change Plan').click();
    cy.withinSnackbar(() => {
      cy.findByText('Subscription Updated').should('be.visible');
    });
    cy.findByText('Plan Overview').should('be.visible');
    cy.findByText('Your Plan').should('be.visible');
    cy.findByText('100,000 emails for $30 per month').should('be.visible');
    cy.url().should('equal', `${Cypress.config().baseUrl}/account/billing`);
  });

  it('Upgrades free account to premier 100K', () => {
    // user is on the test plan
    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.test-plan.json',
    });
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.has-no-credit-card.json',
      fixtureAlias: 'billingGet',
    });
    cy.stubRequest({
      url: '/api/v1/billing/subscription',
      fixture: 'billing/subscription/200.get.test-plan.json',
    });

    cy.visit(PAGE_URL);

    cy.findAllByText('100,000').should('be.visible');
    cy.findAllByText('emails/month').should('be.visible');
    cy.findAllByText('$75').should('be.visible');
    cy.get('[data-id=select-plan-100K-premier-0519]').click();

    fillOutCreditCardForm();

    mockCommonHttpCalls();

    // Then server returns the new plan info that was saved...
    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.100k-premier-plan.json',
    });

    cy.findByText('Change Plan').click();
    cy.withinSnackbar(() => {
      cy.findByText('Subscription Updated').should('be.visible');
    });
    cy.findByText('Plan Overview').should('be.visible');
    cy.findByText('Your Plan').should('be.visible');
    cy.findByText('100,000 emails for $75 per month').should('be.visible');
    cy.url().should('equal', `${Cypress.config().baseUrl}/account/billing`);
  });

  it('Upgrades free account to premier 250K', () => {
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.has-no-credit-card.json',
      fixtureAlias: 'billingGet',
    });
    cy.stubRequest({
      url: '/api/v1/billing/subscription',
      fixture: 'billing/subscription/200.get.test-plan.json',
    });

    cy.visit(PAGE_URL);

    cy.findAllByText('250,000').should('be.visible');
    cy.findAllByText('emails/month').should('be.visible');
    cy.findAllByText('$170').should('be.visible');

    cy.get('[data-id=select-plan-250K-premier-0519]').click();

    fillOutCreditCardForm();
    mockCommonHttpCalls();

    // Then server returns the new plan info that was saved...
    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.250k-premier-plan.json',
    });

    cy.findByText('Change Plan').click();
    cy.withinSnackbar(() => {
      cy.findByText('Subscription Updated').should('be.visible');
    });
    cy.findByText('Plan Overview').should('be.visible');
    cy.findByText('Your Plan').should('be.visible');
    cy.findByText('250,000 emails for $170 per month').should('be.visible');
    cy.url().should('equal', `${Cypress.config().baseUrl}/account/billing`);
  });

  it('Upgrades free account to premier 500K', () => {
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.has-no-credit-card.json',
      fixtureAlias: 'billingGet',
    });
    cy.stubRequest({
      url: '/api/v1/billing/subscription',
      fixture: 'billing/subscription/200.get.test-plan.json',
    });

    cy.visit(PAGE_URL);

    cy.findAllByText('500,000').should('be.visible');
    cy.findAllByText('emails/month').should('be.visible');
    cy.findAllByText('$290').should('be.visible');

    cy.get('[data-id=select-plan-500K-premier-0519]').click();

    fillOutCreditCardForm();
    mockCommonHttpCalls();

    // Then server returns the new plan info that was saved...
    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.500k-premier-plan.json',
    });

    cy.findByText('Change Plan').click();
    cy.withinSnackbar(() => {
      cy.findByText('Subscription Updated').should('be.visible');
    });
    cy.findByText('Plan Overview').should('be.visible');
    cy.findByText('Your Plan').should('be.visible');
    cy.findByText('500,000 emails for $290 per month').should('be.visible');
    cy.url().should('equal', `${Cypress.config().baseUrl}/account/billing`);
  });

  it("Upgrades free account to premier 1M with previous active subaccounts, current quantity of subaccounts doesn't exceed new limit", () => {
    // user is on the test plan
    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.test-plan.json',
    });
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.has-no-credit-card.json',
      fixtureAlias: 'billingGet',
    });
    cy.stubRequest({
      url: '/api/v1/billing/subscription',
      fixture: 'billing/subscription/200.get.test-plan-with-subaccounts.json',
    });

    cy.visit('/account/billing/plan');

    cy.get('[data-id=select-plan-1M-premier-0519]').click();

    cy.findByText('Your new plan only allows for 15 active subaccounts.').should('be.visible');

    fillOutCreditCardForm();
    mockCommonHttpCalls();

    // Then server returns the new plan info that was saved...
    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.1m-premier-plan.json',
    });

    cy.findByText('Change Plan').click();
    cy.withinSnackbar(() => {
      cy.findByText('Subscription Updated').should('be.visible');
    });
    cy.findByText('Plan Overview').should('be.visible');
    cy.findByText('Your Plan').should('be.visible');
    cy.findByText('1,000,000 emails for $525 per month').should('be.visible');
    cy.url().should('equal', `${Cypress.config().baseUrl}/account/billing`);
  });

  it('Upgrades free account to premier 1M', () => {
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.has-no-credit-card.json',
      fixtureAlias: 'billingGet',
    });
    cy.stubRequest({
      url: '/api/v1/billing/subscription',
      fixture: 'billing/subscription/200.get.test-plan.json',
    });

    cy.visit(PAGE_URL);

    cy.get('[data-id=select-plan-1M-premier-0519]').click();

    fillOutCreditCardForm();
    mockCommonHttpCalls();

    // Then server returns the new plan info that was saved...
    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.1m-premier-plan.json',
    });

    cy.findByText('Change Plan').click();
    cy.withinSnackbar(() => {
      cy.findByText('Subscription Updated').should('be.visible');
    });
    cy.findByText('Plan Overview').should('be.visible');
    cy.findByText('Your Plan').should('be.visible');
    cy.findByText('1,000,000 emails for $525 per month').should('be.visible');
    cy.url().should('equal', `${Cypress.config().baseUrl}/account/billing`);
  });

  it('on changing plan renders section with changes to features', () => {
    selectAFreePlan();
    cy.findAllByText('Changes to Features').should('exist');
    cy.findAllByText('Your features have been updated').should('exist');
  });

  it('shows the compare features modal', () => {
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.has-no-credit-card.json',
      fixtureAlias: 'billingGet',
    });
    cy.stubRequest({
      url: '/api/v1/billing/subscription',
      fixture: 'billing/subscription/200.get.test-plan.json',
    });
    cy.visit(PAGE_URL);

    cy.stubRequest({
      method: 'POST',
      url: '/api/v1/billing/cors-data?context=create-account',
      fixture: 'billing/cors-data/200.post.json',
    });
    cy.stubRequest({
      method: 'POST',
      url: '/v1/accounts',
      fixture: 'zuora/accounts/200.post.json',
    });
    cy.stubRequest({
      method: 'POST',
      url: '/api/v1/account/subscription/check',
      fixture: 'account/subscription/check/200.post.json',
    });
    cy.stubRequest({
      method: 'POST',
      url: '/api/v1/billing/subscription/check',
      fixture: 'billing/subscription/check/200.post.json',
    });

    cy.findAllByText('Compare Features').click();

    cy.findAllByText('Test Account').should('be.visible');
    cy.findAllByText('Starter Plans').should('be.visible');
    cy.findAllByText('Premier Plans').should('be.visible');

    cy.findAllByText('Standard Features').should('be.visible');
    cy.findAllByText('Advanced Settings').should('be.visible');

    cy.findAllByText('Content and Recipients')
      .scrollIntoView()
      .should('be.visible');
    cy.findAllByText('Account Management and Support')
      .scrollIntoView()
      .should('be.visible');

    cy.withinModal(() => {
      cy.findByText('Close').click({ force: true });
    });

    cy.findAllByText('Starter Plans').should('not.exist');
    cy.findAllByText('Premier Plans').should('not.exist');
  });
  it('Upgrades from a starter plan to premier plan, with subaccounts limit_override higher than premier subaccount limit', () => {
    // user is on the test plan
    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.100k-starter-plan.json',
    });
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.json',
      fixtureAlias: 'billingGet',
    });
    cy.stubRequest({
      url: '/api/v1/billing/subscription',
      fixture: 'billing/subscription/200.get.starter-plan-higher-subaccounts-limitoverride.json',
    });

    cy.visit('/account/billing/plan');

    cy.get('[data-id=select-plan-1M-premier-0519]').click();

    cy.findByText('Your new plan only allows for 15 active subaccounts.').should('not.exist');

    cy.stubRequest({
      url: '/api/v1/billing/subscription/bundle',
      fixture: 'billing/subscription/bundle/200.put.json',
      method: 'PUT',
    });

    mockCommonHttpCalls();

    // Then server returns the new plan info that was saved...
    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.1m-premier-plan.json',
    });

    cy.findByText('Change Plan').click();
    cy.withinSnackbar(() => {
      cy.findByText('Subscription Updated').should('be.visible');
    });
    cy.findByText('Plan Overview').should('be.visible');
    cy.findByText('Your Plan').should('be.visible');
    cy.findByText('1,000,000 emails for $525 per month').should('be.visible');
    cy.url().should('equal', `${Cypress.config().baseUrl}/account/billing`);
  });

  it('downgrades from premier to starter with quantity exceeding limit_override', () => {
    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.250k-premier-plan.json',
      requestAlias: 'accountGet',
    });
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.json',
      fixtureAlias: 'billingGet',
      requestAlias: 'billingGet',
    });
    cy.stubRequest({
      url: '/api/v1/billing/subscription',
      fixture: 'billing/subscription/200.get.premier-plan-with-limitoverride.json',
      requestAlias: 'subscriptionGet',
    });

    cy.visit('/account/billing/plan');

    cy.get('[data-id=select-plan-50K-starter-0519]').click();

    cy.findByText(/Update Status*/).should('be.visible');
  });

  it('Upgrades from free to paid using a promo code', () => {
    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.test-plan.json',
    });
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.has-no-credit-card.json',
      fixtureAlias: 'billingGet',
    });
    cy.stubRequest({
      url: '/api/v1/billing/subscription',
      fixture: 'billing/subscription/200.get.test-plan.json',
    });
    cy.stubRequest({
      url: '/api/v1/billing/subscription/promo-codes/*',
      fixture: 'billing/subscription/promo-codes/200.get.json',
      fixtureAlias: 'promoGet',
    });
    cy.stubRequest({
      method: 'POST',
      url: '/api/v1/billing/subscription/promo-codes/*',
      fixture: 'blank.json',
      fixtureAlias: 'promoGet',
    });

    cy.visit(PAGE_URL);

    cy.get('[data-id=select-plan-100K-premier-0519]').click();

    cy.findByLabelText('Promo Code').type('THXFISH2');
    cy.findByText('Apply').click();
    cy.findByText('Remove').click();
    cy.findByLabelText('Promo Code').type('THXFISH2');
    cy.findByText('Apply').click();

    fillOutCreditCardForm();

    mockCommonHttpCalls();

    cy.findAllByText('Change Plan').click();

    cy.withinSnackbar(() => {
      cy.findByText('Subscription Updated').should('be.visible');
    });

    cy.url().should('equal', `${Cypress.config().baseUrl}/account/billing`);
  });

  it('Retains credit card information between plan changes', () => {
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.has-no-credit-card.json',
      fixtureAlias: 'billingGet',
    });
    cy.stubRequest({
      url: '/api/v1/billing/subscription',
      fixture: 'billing/subscription/200.get.test-plan.json',
    });

    // they visit the billing page and change to the starter 50k plan
    cy.visit(PAGE_URL);
    cy.get('[data-id=select-plan-50K-starter-0519]').click();

    cy.findByText('Your features have been updated').should('be.visible');
    cy.findByText('Authentication and Security').should('be.visible');
    cy.findByText('Your new plan no longer allows for single sign-on.').should('be.visible');

    fillOutCreditCardForm();

    cy.findByText('Change').click();
    cy.get('[data-id=select-plan-100K-starter-0519]').click();

    // the CC info is still there! Woot!
    cy.findByLabelText('Credit Card Number').should('have.value', '4000 0000 0000 0000');
    cy.findByLabelText('Cardholder Name').should('have.value', 'Test Account');
    cy.findByLabelText('Expiration Date').should('have.value', '03 / 33');
    cy.findByLabelText('Security Code').should('have.value', '123');
    cy.findByLabelText('Country').should('have.value', 'US');
    cy.findByLabelText('State').should('have.value', 'MD');
    cy.findByLabelText('Zip Code').should('have.value', '12345');
  });
});
