import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";

async function getAccount(
    conn: Connection,
    userKeyPair: Keypair,
    mint: PublicKey
) {
    console.log("Fetching or creating associated token account");
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      conn,
      userKeyPair,
      mint,
      userKeyPair.publicKey
    );
  
    console.log("Token associated account: ", tokenAccount.address.toBase58());

    return tokenAccount;
  }

const AccountService = {
    getAccount
};

export default AccountService;
