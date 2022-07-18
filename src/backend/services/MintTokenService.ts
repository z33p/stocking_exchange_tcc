import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import SolanaService from './SolanaService';

async function createToken(token: Token) {
  console.log(`Minting new token ${token.name}`);

  const conn = await SolanaService.establishConnection();
  const payer = await SolanaService.getPayer();

  const mintAuthority = token.mintAuthority
      ? new PublicKey(token.mintAuthority)
      : payer.publicKey;

  const freezeAuthority = token.freezeAuthority
      ? new PublicKey(token.freezeAuthority)
      : null;

  const mint = await createMint(
      conn,
      payer,
      mintAuthority,
      freezeAuthority,
      9 // We are using 9 to match the CLI decimal default exactly
  );

  const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      conn,
      payer,
      mint,
      payer.publicKey
  );

  await mintTo(
      conn,
      payer,
      mint,
      userTokenAccount.address,
      payer,
      token.supply
  );

  token.address = mint.toBase58();
  token.mintAuthority = mintAuthority.toBase58();

  if (freezeAuthority)
      token.freezeAuthority = freezeAuthority.toBase58();

  console.log(`Token ${token.name} minted address ${token.address}`);

  return token;
}

const MintTokenService = {
  createToken
}

export default MintTokenService;