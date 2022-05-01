import path from "path";

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
const PROGRAM_SO_PATH = path.join(PROGRAM_PATH, 'greeting.so');

/**
 * Path to the keypair of the deployed program.
 * This file is created when running `solana program deploy dist/program/greeting.so`
 */
const PROGRAM_KEYPAIR_PATH = path.join(PROGRAM_PATH, 'greeting-keypair.json');

// Derive the address (public key) of a greeting account from the program so that it's easy to find later.
const GREETING_SEED = 'hello';

export {
    PROGRAM_PATH,
    PROGRAM_SO_PATH,
    PROGRAM_KEYPAIR_PATH,
    GREETING_SEED
}