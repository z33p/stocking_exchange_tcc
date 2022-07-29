import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";

async function getAssociatedAccount(
  conn: Connection,
  userKeyPair: Keypair,
  mint: PublicKey
) {
  console.log("Fetching or creating associated token account");
  const token = new Token(conn, mint, TOKEN_PROGRAM_ID, userKeyPair);
  const tokenAccount = await token.getOrCreateAssociatedAccountInfo(userKeyPair.publicKey);

  return tokenAccount;
}

async function getAccount(
  conn: Connection,
  userKeyPair: Keypair,
  mint: PublicKey,
  accountPk: PublicKey
) {
  console.log("Fetching token account");
  const token = new Token(conn, mint, TOKEN_PROGRAM_ID, userKeyPair);
  const tokenAccount = await token.getAccountInfo(accountPk);

  return tokenAccount;
}

const AccountService = {
  getAccount,
  getAssociatedAccount,
};

export default AccountService;
