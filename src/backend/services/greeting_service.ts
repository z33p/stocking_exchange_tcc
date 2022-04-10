import {
  Keypair,
  Connection,
  PublicKey,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram,
} from '@solana/web3.js';
import * as borsh from 'borsh';
import path from 'path';
import * as solana_service from "./solana_service";

export async function greeting() {
  console.log("Let's say hello to a Solana account...");

  // Say hello to an account
  const greetedPubkey = await sayHello();

  // Find out how many times that account has been greeted
  await reportGreetings(greetedPubkey);

  console.log('Success');
}

/**
 * Path to program files
 */
const PROGRAM_PATH = path.resolve(__dirname, '../../../dist/program');

/**
 * Path to program shared object file which should be deployed on chain.
 * This file is created when running either:
 *   - `npm run build:program-c`
 *   - `npm run build:program-rust`
 */
const PROGRAM_SO_PATH = path.join(PROGRAM_PATH, 'helloworld.so');

/**
 * Path to the keypair of the deployed program.
 * This file is created when running `solana program deploy dist/program/helloworld.so`
 */
const PROGRAM_KEYPAIR_PATH = path.join(PROGRAM_PATH, 'helloworld-keypair.json');


/**
 * The state of a greeting account managed by the hello world program
 */
class GreetingAccount {
  counter = 0;
  constructor(fields: { counter: number } | undefined = undefined) {
    if (fields) {
      this.counter = fields.counter;
    }
  }
}

/**
 * Borsh schema definition for greeting accounts
 */
const GreetingSchema = new Map([
  [GreetingAccount, { kind: 'struct', fields: [['counter', 'u32']] }],
]);

/**
 * The expected size of each greeting account.
 */
const GREETING_SIZE = borsh.serialize(
  GreetingSchema,
  new GreetingAccount(),
).length;


// Derive the address (public key) of a greeting account from the program so that it's easy to find later.
const GREETING_SEED = 'hello';

async function sayHello(): Promise<PublicKey> {
  const payer = await solana_service.establishPayer(GREETING_SIZE);
  const conn = await solana_service.establishConnection();

  const programId = await solana_service.checkProgram(conn, PROGRAM_SO_PATH, PROGRAM_KEYPAIR_PATH);


  // Derive the address (public key) of a greeting account from the program so that it's easy to find later.
  const greetedPubkey = await getGreetedPubKey(payer, programId, conn);

  await createGreetingAccountIfNotExists(programId, payer, conn, greetedPubkey);

  console.log('Saying hello to', greetedPubkey.toBase58());
  const instruction = new TransactionInstruction({
    keys: [{ pubkey: greetedPubkey, isSigner: false, isWritable: true }],
    programId,
    data: Buffer.alloc(0), // All instructions are hellos
  });
  await sendAndConfirmTransaction(
    conn,
    new Transaction().add(instruction),
    [payer],
  );

  return greetedPubkey;
}

async function getGreetedPubKey(payer: Keypair, programId: PublicKey, conn: Connection) {
  const GREETING_SEED = 'hello';

  const greetedPubkey = await PublicKey.createWithSeed(
    payer.publicKey,
    GREETING_SEED,
    programId
  );

  return greetedPubkey;
}

async function createGreetingAccountIfNotExists(programId: PublicKey, payer: Keypair, conn: Connection, greetedPubkey: PublicKey) {
  console.log(`Using program ${programId.toBase58()}`);

  // Check if the greeting account has already been created
  const greetedAccount = await conn.getAccountInfo(greetedPubkey);

  if (greetedAccount)
    return;

  console.log(
    'Creating account',
    greetedPubkey.toBase58(),
    'to say hello to'
  );

  const lamports = await conn.getMinimumBalanceForRentExemption(
    GREETING_SIZE
  );

  const transaction = new Transaction().add(
    SystemProgram.createAccountWithSeed({
      fromPubkey: payer.publicKey,
      basePubkey: payer.publicKey,
      seed: GREETING_SEED,
      newAccountPubkey: greetedPubkey,
      lamports,
      space: GREETING_SIZE,
      programId,
    })
  );

  await sendAndConfirmTransaction(conn, transaction, [payer]);
}

/**
 * Report the number of times the greeted account has been said hello to
 */
async function reportGreetings(greetedPubkey: PublicKey): Promise<void> {
  const conn = await solana_service.establishConnection();

  const accountInfo = await conn.getAccountInfo(greetedPubkey);
  if (accountInfo === null) {
    throw 'Error: cannot find the greeted account';
  }

  const greeting = borsh.deserialize(
    GreetingSchema,
    GreetingAccount,
    accountInfo.data,
  );

  console.log(
    greetedPubkey.toBase58(),
    'has been greeted',
    greeting.counter,
    'time(s)',
  );
}
