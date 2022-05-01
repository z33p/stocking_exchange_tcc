import * as borsh from 'borsh';

/**
 * The state of a greeting account managed by the hello world program
 */
class GreetingAccount {
  counter = 0;

  constructor(fields: { counter: number; } | undefined = undefined) {
    if (fields) {
      this.counter = fields.counter;
    }
  }

  /**
 * Borsh schema definition for greeting accounts
 */
  static GreetingSchema: Map<typeof GreetingAccount, IGreetingShcema> = new Map([
    [
      GreetingAccount,
      {
        kind: 'struct',
        fields: [['counter', 'u32']]
      }
    ],
  ]);

  /**
 * The expected size of each greeting account.
 */
  static GREETING_SIZE = borsh.serialize(GreetingAccount.GreetingSchema, new GreetingAccount()).length;
}

interface IGreetingShcema {
  kind: string;
  fields: string[][];
}

export default GreetingAccount;
