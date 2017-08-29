import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Field, reduxForm } from 'redux-form';
import { Button, Grid } from '@sparkpost/matchbox';
import { TextFieldWrapper, SelectWrapper } from '../../../components/reduxFormWrappers';

const getCcYears = () => {
  const year = new Date().getFullYear();
  return _.range(year, year + 20).map((y) => {
    return { label: y.toString(), value: y.toString() };
  });
};

const cardOptions = [
  { value: 'Visa', label: 'Visa' },
  { value: 'MasterCard', label: 'Master Card' },
  { value: 'AmericanExpress', label: 'American Express' },
  { value: 'Discover', label: 'Discover' }
];

const monthOptions = [
  { value: '01', label: '01' },
  { value: '02', label: '02' },
  { value: '03', label: '03' },
  { value: '04', label: '04' },
  { value: '05', label: '05' },
  { value: '06', label: '06' },
  { value: '07', label: '07' },
  { value: '08', label: '08' },
  { value: '08', label: '08' },
  { value: '10', label: '10' },
  { value: '11', label: '11' },
  { value: '12', label: '12' }
];

let CreditCardForm = (props) => {
  const { handleSubmit, backToPlans, countries, hasBilling } = props;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        { !hasBilling &&
          <div>
            <Grid>
              <Grid.Column>
                <div>Billing Contact
                  <Field
                    name='firstName'
                    label='First Name'
                    placeholder=''
                    component={TextFieldWrapper}/>
                  <Field
                    name='lastName'
                    label='Last Name'
                    placeholder=''
                    component={TextFieldWrapper}/>
                  <Field
                    name='email'
                    label='Email'
                    placeholder=''
                    component={TextFieldWrapper}/>
                </div>
              </Grid.Column>
              <Grid.Column>
                <div>Card Details
                  <Field
                    name='cardType'
                    label='Card Type'
                    options={cardOptions}
                    component={SelectWrapper}
                  />
                  <Field
                    name='cardNumber'
                    label='Card Number'
                    placeholder='**** **** **** ****'
                    component={TextFieldWrapper}/>
                  <Field
                    name='cardName'
                    label='Name on Card'
                    placeholder=''
                    component={TextFieldWrapper}/>
                  <Field
                    name='expirationMonth'
                    label='Expiration Month'
                    options={monthOptions}
                    component={SelectWrapper} />
                  <Field
                    name='expirationYear'
                    label='Expiration Year'
                    options={getCcYears()}
                    component={SelectWrapper} />
                  <Field
                    name='cvc'
                    label='CVC'
                    placeholder='***'
                    component={TextFieldWrapper} />
                  <Field
                    name='billingId'
                    type='hidden'
                    component='input' />
                </div>
              </Grid.Column>
              <Grid.Column>
                <div>Billing Address
                <Field
                  name='address1'
                  label='Address 1'
                  placeholder=''
                  component={TextFieldWrapper}/>
                <Field
                  name='address2'
                  label='Address 2'
                  placeholder=''
                  component={TextFieldWrapper}/>
                <Field
                  name='city'
                  label='City'
                  placeholder=''
                  component={TextFieldWrapper}/>
                <Field
                  name='state'
                  label='State'
                  placeholder=''
                  component={TextFieldWrapper}/>
                <Field
                  name='zipCode'
                  label='Zip Code'
                  placeholder=''
                  component={TextFieldWrapper}/>
                <Field
                  name='country'
                  label='Country'
                  options={countries}
                  component={SelectWrapper}/>
                </div>
              </Grid.Column>
            </Grid>
          </div> }
        <Button submit primary={true}>Upgrade</Button>
        <Button onClick={backToPlans}>Back to Plans</Button>
      </form>
    </div>
  );
};

const formName = 'creditCardForm';

CreditCardForm = reduxForm({
  form: formName
})(CreditCardForm);

const mapStateToProps = (state, props) => {
  const { currentUser, billingId } = props;

  return {
    initialValues: {
      cardNumber: '4111111111111111',
      cardType: 'Visa',
      expirationMonth: '02',
      expirationYear: '2018',
      cardName: currentUser.first_name + ' ' + currentUser.last_name,
      email: currentUser.email,
      firstName: currentUser.first_name,
      lastName: currentUser.last_name,
      billingId: billingId,
      address1: '123 William St',
      city: 'Baltmore',
      state: 'Maryland',
      country: 'US',
      zipCode: '55555',
      cvc: '123'
    }
  };
};

CreditCardForm = connect(mapStateToProps)(CreditCardForm);

export default CreditCardForm;
