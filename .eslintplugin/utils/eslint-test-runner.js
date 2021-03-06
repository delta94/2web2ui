import { Linter } from 'eslint';

// note, experimented with RuleTester, too much magic and no easy way to set each test description
//   because only "code" is provided to "it"
// see, https://eslint.org/docs/developer-guide/nodejs-api#ruletester
const runner = (title, rule, { valid = {}, invalid = {} } = {}) => {
  describe(title, () => {
    const linter = new Linter();

    linter.defineRules({ [title]: rule });

    Object.keys(valid).forEach(description => {
      it(description, () => {
        const result = linter.verify(
          valid[description].code,
          {
            rules: { [title]: 'error' },
            parserOptions: {
              ecmaVersion: 7,
              sourceType: 'module',
            },
          },
          {
            filename: valid[description].filename,
          },
        );

        expect(result.length === 0).toEqual(true);
      });
    });

    Object.keys(invalid).forEach(description => {
      it(description, () => {
        const result = linter.verify(
          invalid[description].code,
          {
            rules: { [title]: 'error' },
            parserOptions: {
              ecmaVersion: 7,
              sourceType: 'module',
            },
          },
          {
            filename: invalid[description].filename,
          },
        );

        expect(result[0].message).toEqual(invalid[description].errors[0].message);
      });
    });
  });
};

// eslint-disable-next-line jest/no-export
module.exports = runner;
