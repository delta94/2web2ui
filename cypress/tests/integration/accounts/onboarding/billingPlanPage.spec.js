import { USERNAME } from 'cypress/constants';

describe('The billing plan page', () => {
  beforeEach(() => {
    // todo, this user should be joining not logging-in
    cy.stubAuth();
    cy.stubRequest({
      url: '/api/v1/account/countries?filter=billing',
      fixture: 'account/countries/200.get.billing-filter.json',
      requestAlias: 'getCountries',
    });
    cy.stubRequest({
      url: '/api/v1/billing/bundles**',
      fixture: 'billing/bundles/200.get.json',
      fixtureAlias: 'bundlesGet',
      requestAlias: 'bundlesGet',
    });

    cy.stubRequest({
      url: '/api/v1/billing/plans',
      fixture: 'billing/plans/200.get.json',
      fixtureAlias: 'billingPlansGet',
      requestAlias: 'billingPlansGet',
    });

    cy.login({ isStubbed: true });
    cy.visit('/onboarding/plan');
    cy.wait(['@getCountries', '@bundlesGet', '@billingPlansGet']);
  });

  it('renders with a relevant page title', () => {
    cy.title().should('include', 'Onboarding');
  });

  it('renders the plan selection custom select', () => {
    cy.findByText('Select A Plan').should('be.visible');
  });

  it('renders with a link to the SparkPost knowledge base', () => {
    cy.findByText('Knowledge Base').should(
      'have.attr',
      'href',
      'https://www.sparkpost.com/docs/faq/difference-between-starter-and-premier',
    );
  });

  describe('the plan selection custom select', () => {
    it('opens when the title is clicked', () => {
      cy.get('[data-id="plan-picker-trigger"]').click();
      cy.findByText('Test Account').should('be.visible');
      cy.findByText('Starter').should('be.visible');
    });

    it('hides the credit card form when the user selects the test account', () => {
      cy.get('[data-id="plan-picker-trigger"]').click();
      cy.findByText('Full-featured developer account').click();

      cy.findByLabelText('Promo Code').should('not.exist');
      cy.findByLabelText('Credit Card Number').should('not.exist');
      cy.findByLabelText('Cardholder Name').should('not.exist');
      cy.findByLabelText('Expiration Date').should('not.exist');
      cy.findByLabelText('Security Code').should('not.exist');
      cy.findByLabelText('Country').should('not.exist');
      cy.findByLabelText('State').should('not.exist');
      cy.findByLabelText('Zip Code').should('not.exist');
    });

    it('get started with a test account', () => {
      cy.get('[data-id="plan-picker-trigger"]').click();
      cy.findByText('Full-featured developer account').click();
      cy.findByText('Get Started').click();
      cy.title().should('include', 'Dashboard | SparkPost');
    });

    it('shows the credit card form when the user selects a non free plan', () => {
      cy.get('[data-id="plan-picker-trigger"]').click();
      cy.findAllByRole('option')
        .eq(1)
        .click();

      cy.findByLabelText('Promo Code').should('be.visible');
      cy.findByLabelText('Credit Card Number').should('be.visible');
      cy.findByLabelText('Cardholder Name').should('be.visible');
      cy.findByLabelText('Expiration Date').should('be.visible');
      cy.findByLabelText('Security Code').should('be.visible');
      cy.findByLabelText('Country').should('be.visible');
      cy.findByLabelText('State').should('be.visible');
      cy.findByLabelText('Zip Code').should('be.visible');
    });
  });

  describe('the credit card form', () => {
    it('has a country select that controls rendering of a state field when the user selects anything other than "United States"', () => {
      cy.findByLabelText('Country').select('United States');
      cy.findByLabelText('State').should('be.visible');
      cy.findByLabelText('Country').select('Albania');
      cy.findByLabelText('State').should('not.exist');
    });

    it('has a credit card field which provides user feedback when the entered value is not an accepted format', () => {
      cy.findByLabelText('Credit Card Number')
        .type('1111111111111111')
        .blur();

      cy.findByText('We only accept Visa, MasterCard, AmericanExpress, Discover').should(
        'be.visible',
      );
    });

    it('renders the first and last name fields when the user account does not have a stored first and last name', () => {
      cy.stubRequest({
        fixture: 'users/200.get.no-first-or-last-names.json',
        url: `/api/v1/users/${USERNAME}`,
      });

      cy.visit('/onboarding/plan'); // Revisit page to override existing stub in `beforeEach()`

      cy.findByLabelText('First Name').should('be.visible');
      cy.findByLabelText('Last Name').should('be.visible');
    });

    it('does not render the first and last name fields when the user account has a stored first and last name', () => {
      cy.stubRequest({
        fixture: 'users/200.get.json',
        url: `/api/v1/users/${USERNAME}`,
      });

      cy.visit('/onboarding/plan'); // Revisit page to override existing stub in `beforeEach()`

      cy.findByLabelText('First Name').should('not.exist');
      cy.findByLabelText('Last Name').should('not.exist');
    });

    it('shows "Required" errors on all required fields when the user attempts to submit the form before completing relevant data', () => {
      cy.findByText('Get Started').click();
      cy.findAllByText('Required').should('have.length', 5);
    });

    it('get started with a paid account', () => {
      cy.stubRequest({
        method: 'POST',
        url: '/api/v1/billing/cors-data?context=create-account',
        fixture: 'billing/cors-data/200.post.json',
        requestAlias: 'billingCorsDataPost',
      });

      cy.stubRequest({
        method: 'POST',
        url: '/v1/accounts',
        fixture: 'zuora/accounts/200.post.json',
        requestAlias: 'zuoraAccountPost',
      });

      cy.stubRequest({
        method: 'POST',
        url: '/api/v1/account/subscription/check',
        fixture: 'account/subscription/check/200.post.json',
        requestAlias: 'accountSubscriptionCheckPost',
      });

      cy.stubRequest({
        method: 'POST',
        url: '/api/v1/billing/subscription/check',
        fixture: 'billing/subscription/check/200.post.json',
        requestAlias: 'billingSubscriptionCheckPost',
      });

      cy.stubRequest({
        url: '/api/v1/billing',
        fixture: 'billing/200.get.json',
        requestAlias: 'billingGet',
      });

      cy.get('[data-id="plan-picker-trigger"]').click();
      cy.findByText('50,000').click();
      cy.findByLabelText('Credit Card Number').type('4321432143214321');
      cy.findByLabelText('Cardholder Name').type('Leslie Knope');
      cy.findByLabelText('Expiration Date').type('1/99');
      cy.findByLabelText('Security Code').type('123');
      cy.findByLabelText('Zip Code').type('12345');
      cy.findByText('Get Started').click();

      // should we do this, verify API requests, more often? the purpose of this experiment was to
      // see how easy it is to confirm the values just provided above are correctly passed to the API
      cy.wait([
        '@billingCorsDataPost',
        '@zuoraAccountPost',
        '@accountSubscriptionCheckPost',
        '@billingSubscriptionCheckPost',
        '@billingGet',
      ]).spread((billingCorsDataPost, zuoraAccountPost) => {
        // eslint-disable-next-line jest/valid-expect
        expect(billingCorsDataPost.request.body).to.include({
          bin: '432143', // first six digits of credit card
          cardholder_name: 'Leslie Knope',
          country: 'US',
          last_four: '4321', // last for digits of credit card
          plan_id: '2c92c0f96a346078016a4ff143fb2a5a', // provided by fixture
          state: 'AL',
          zip_code: '12345',
        });

        // eslint-disable-next-line jest/valid-expect
        expect(zuoraAccountPost.request.body).to.include({
          accountNumber: '12345', // provided by fixture
        });

        // eslint-disable-next-line jest/valid-expect
        expect(zuoraAccountPost.request.body.billToContact).to.include({
          country: 'US',
          state: 'AL',
          zipCode: '12345',
        });

        // eslint-disable-next-line jest/valid-expect
        expect(zuoraAccountPost.request.body.creditCard).to.include({
          cardNumber: '4321 4321 4321 4321',
          cardType: 'Visa', // determined by library
          expirationMonth: 1,
          expirationYear: 2099,
          securityCode: '123',
        });

        // eslint-disable-next-line jest/valid-expect
        expect(zuoraAccountPost.request.body.creditCard.cardHolderInfo).to.include({
          cardHolderName: 'Leslie Knope',
          // state: 'AL', // no state?
          zipCode: '12345',
        });

        // eslint-disable-next-line jest/valid-expect
        expect(zuoraAccountPost.request.body.subscription.subscribeToRatePlans).to.deep.equal([
          {
            productRatePlanId: '2c92c0f96a346078016a4ff143fb2a5a', // provided by fixture
          },
        ]);
      });

      cy.title().should('include', 'Dashboard | SparkPost');
    });

    describe('the promo code field', () => {
      it('renders an "Invalid promo code" error when no valid promo code is found', () => {
        cy.stubRequest({
          fixture: 'billing/subscription/promo-codes/400.get.json',
          url: '/api/v1/billing/subscription/promo-codes/*',
          statusCode: 400,
          requestAlias: 'invalidPromoCodeRequest',
        });

        cy.findByLabelText('Promo Code').type('abc');
        cy.findByText('Apply').click();

        cy.wait('@invalidPromoCodeRequest');

        cy.findByText('Invalid promo code').should('be.visible');
      });

      it('renders a "Resource could not be found" error when no entry is made in the promo code field and the user clicks "Apply"', () => {
        cy.stubRequest({
          url: '/api/v1/billing/subscription/promo-codes/*',
          fixture: 'billing/subscription/promo-codes/404.get.json',
          statusCode: 404,
          requestAlias: 'resourceNotFoundRequest',
        });

        cy.findByText('Apply').click();

        cy.findByText('Resource could not be found');
      });

      it('applies the promo code when the promo code is valid', () => {
        cy.stubRequest({
          url: '/api/v1/billing/subscription/promo-codes/*',
          fixture: 'billing/subscription/promo-codes/200.get.json',
        });

        cy.findByLabelText('Promo Code').type('abc');
        cy.findByText('Apply').click();
        cy.findByText('$37.50').should('be.visible'); // Half of the starting value of $75.00 - determined by the fixture `discount_percentage` value
        cy.findByLabelText('Promo Code').should('be.disabled');
        cy.findByText('Apply').should('not.exist');
        cy.findByText('Remove').click();
        cy.findByText('$37.50').should('not.exist'); // Half of the starting value of $75.00 - determined by the fixture `discount_percentage` value
      });
    });
  });
});
