import React from 'react';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import AuthenticationGate from './components/AuthenticationGate';

// Pages
import {
  AuthPage,
  DashboardPage,
  SummaryReportPage,
  ProfilePage,
  TemplatesListPage,
  TemplatesEditPage,
  TemplatesPublishedPage,
  TemplatesCreatePage,
  webhooks
} from './pages';

import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';

const ForgotPassword = () => <h1>Forgot Password</h1>;

export default () => (
  <Router>
    <div>
      <AuthenticationGate />

      <Route exact path='/' render={() => <Redirect to='/auth' />} />
      <Route path='/auth' component={AuthPage} />
      <Route path='/forgot-password' component={ForgotPassword} />

      <ProtectedRoute path='/dashboard' component={DashboardPage} />
      <Route path='/reports' render={() => <Redirect to='/reports/summary' />} />
      <ProtectedRoute path='/reports/summary' component={SummaryReportPage} />

      <ProtectedRoute exact path='/templates' component={TemplatesListPage} />
      <ProtectedRoute exact path='/templates/create/' component={TemplatesCreatePage} />
      <ProtectedRoute exact path='/templates/edit/:id' component={TemplatesEditPage} />
      <ProtectedRoute exact path='/templates/edit/:id/published' component={TemplatesPublishedPage} />
      {/* <ProtectedRoute exact path='/templates/edit/:id/preview' component={TemplatesEditPage} /> */}

      <ProtectedRoute path='/account/profile' component={ProfilePage} />
      <ProtectedRoute exact path='/webhooks' component={webhooks.HomePage}/>
      <ProtectedRoute exact path='/webhooks/create' component={webhooks.CreatePage}/>
      <ProtectedRoute exact path='/webhooks/details/:id' component={webhooks.DetailsPage}/>
    </div>
  </Router>
);
