import ZuoraApiError from '../zuoraApiError';

function createTestError(sugar = {}) {
  const error = new Error('Oh No!');
  return new ZuoraApiError(Object.assign(error, sugar));
}

describe('ZuoraApiError', () => {
  it('instance of ZuoraApiError', () => {
    const error = createTestError();
    expect(error).toBeInstanceOf(ZuoraApiError);
  });

  it('instance of Error', () => {
    const error = createTestError();
    expect(error).toBeInstanceOf(Error);
  });

  it('returns error name', () => {
    const error = createTestError();
    expect(error).toHaveProperty('name', 'ZuoraApiError');
  });

  it('returns error message', () => {
    const error = createTestError({ response: { data: { success: false } } });
    expect(error).toHaveProperty(
      'message',
      'An error occurred while contacting the billing service',
    );
  });

  it('returns api error message', () => {
    const error = createTestError({
      response: {
        data: {
          success: false,
          reasons: [
            {
              code: 53100320,
              message: "'termType' value should be one of: TERMED, EVERGREEN",
            },
            {
              code: 53100321,
              message: 'some other zuora error',
            },
          ],
        },
      },
    });

    expect(error).toHaveProperty('message', "'termType' value should be one of: TERMED, EVERGREEN");
  });

  it('returns a network error if no axios response', () => {
    const error = createTestError();
    expect(error).toHaveProperty(
      'message',
      'You may be having network issues or an adblocker may be blocking part of the app.',
    );
  });

  it('returns extra properties', () => {
    const error = createTestError({
      extra: 'shh',
    });
    expect(error).toHaveProperty('extra');
  });
});
