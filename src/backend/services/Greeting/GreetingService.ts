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
import SolanaService from "../SolanaService";
import GreetingAccount from "./GreetingAccount";
import { GREETING_SEED, PROGRAM_KEYPAIR_PATH, PROGRAM_SO_PATH } from "./GreetingConstants"

async function greeting() {
  console.log("Let's say hello to a Solana account...");

  // Say hello to an account
  const greetedPubkey = await sayHello();

  // Find out how many times that account has been greeted
  await reportGreetings(greetedPubkey);

  console.log('Success');
}

async function sayHello(): Promise<PublicKey> {
  const conn = await SolanaService.establishConnection();

  const payer = await SolanaService.establishPayer(conn, GreetingAccount.GREETING_SIZE);
  const programId = await SolanaService.checkProgram(conn, PROGRAM_SO_PATH, PROGRAM_KEYPAIR_PATH);

  // Derive the address (public key) of a greeting account from the program so that it's easy to find later.
  const greetedPubkey = await createGreetedPubKey(payer, programId);

  await createGreetedAccountIfNotExists(conn, programId, payer, greetedPubkey);

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

async function createGreetedPubKey(payer: Keypair, programId: PublicKey): Promise<PublicKey> {
  const greetedPubkey = await PublicKey.createWithSeed(
    payer.publicKey,
    GREETING_SEED,
    programId
  );

  return greetedPubkey;
}

async function createGreetedAccountIfNotExists(
  conn: Connection,
  programId: PublicKey,
  payer: Keypair,
  greetedPubkey: PublicKey,
) {
  console.log(`Using program ${programId.toBase58()}`);

  const greetedAccount = await conn.getAccountInfo(greetedPubkey);

  if (greetedAccount)
    return;

  console.log(
    'Creating account',
    greetedPubkey.toBase58(),
    'to say hello to'
  );

  const lamports = await conn.getMinimumBalanceForRentExemption(GreetingAccount.GREETING_SIZE);

  const transaction = new Transaction().add(
    SystemProgram.createAccountWithSeed({
      fromPubkey: payer.publicKey,
      basePubkey: payer.publicKey,
      seed: GREETING_SEED,
      newAccountPubkey: greetedPubkey,
      lamports,
      space: GreetingAccount.GREETING_SIZE,
      programId,
    })
  );

  await sendAndConfirmTransaction(conn, transaction, [payer]);
}

/**
 * Report the number of times the greeted account has been said hello to
 */
async function reportGreetings(greetedPubkey: PublicKey): Promise<void> {
  const conn = await SolanaService.establishConnection();

  const accountInfo = await conn.getAccountInfo(greetedPubkey);
  if (accountInfo === null) {
    throw 'Error: cannot find the greeted account';
  }

  const greeting = borsh.deserialize(
    GreetingAccount.GreetingSchema,
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
const GreetingService = {
  greeting
};

export default GreetingService;
