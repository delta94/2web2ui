// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands';
import '@cypress/code-coverage/support';

// Used to help log `cy.log()` invocations to the console during headless runs.
// See: https://github.com/cypress-io/cypress/issues/3199#issuecomment-529430701
Cypress.Commands.overwrite('log', (subject, message) => cy.task('log', message));

Cypress.Cookies.defaults({
  preserve: ['website_auth', '__ssid', 'auth'], // Preserves signed-in state between route changes
});
