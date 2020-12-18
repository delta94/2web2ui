import { IS_HIBANA_ENABLED } from 'cypress/constants';

// TODO: Add testing for subaccount reporting user role

const PAGE_URL = '/dashboard';
const accountDropdownSelector = '[data-id="nav-button-accounts"]';
const navigationButtonSelector = '[data-id="nav-button-mobilemenu"]';
const navigationListSelector = '[data-id="navigation-list"]';
const accountDropdownListSelector = '[data-id="account-dropdown-list"]';

function clickMenuItem(menuItemName) {
  cy.contains(menuItemName).click();
}

function openNavigation() {
  cy.get(navigationButtonSelector).click();
}

function openAccountMenu() {
  cy.get(accountDropdownSelector).click();
}

function assertNavigationIsVisible() {
  cy.get(navigationListSelector).should('be.visible');
}

function assertNavigationIsNotVisible() {
  cy.get(navigationListSelector).should('not.be.visible');
}

function assertAccountMenuIsVisible() {
  cy.get(accountDropdownListSelector).should('be.visible');
}

function assertAccountMenuIsNotVisible() {
  cy.get(accountDropdownListSelector).should('not.exist');
}

if (!IS_HIBANA_ENABLED) {
  describe('The navigation behavior', () => {
    beforeEach(() => {
      cy.viewport(500, 1000);
      cy.stubAuth();
      cy.login({ isStubbed: true });
      cy.visit(PAGE_URL);
      /*
          Wait is included to wait for window resize event as mobile navigation
          is controlled via window resize events instead of CSS. Ideally, CSS media
          queries could be used to show and hide the two version of the navigation
          to improve performance and reduce the likelihood of unusual
          application states
        */
      /* eslint-disable-next-line */
      cy.wait(500);
    });

    it('opens when clicking on the hamburger icon', () => {
      openNavigation();
      assertNavigationIsVisible();
    });

    it('stays open after clicking menu item with child', () => {
      openNavigation();
      clickMenuItem('Signals Analytics');
      assertNavigationIsVisible();
      cy.contains('Bounce').should('be.visible');
    });

    it('closes after clicking child menu item', () => {
      openNavigation();
      clickMenuItem('Signals Analytics');
      clickMenuItem('Bounce');
      assertNavigationIsNotVisible();
    });

    it('closes after clicking top level menu item with no children', () => {
      openNavigation();
      clickMenuItem('Events');
      assertNavigationIsNotVisible();
    });

    it('closes after opening admin menu', () => {
      openNavigation();
      openAccountMenu();
      assertNavigationIsNotVisible();
      assertAccountMenuIsVisible();
    });

    it('causes admin menu to close after opening', () => {
      openAccountMenu();
      openNavigation();
      assertNavigationIsVisible();
      assertAccountMenuIsNotVisible();
    });
  });
}
