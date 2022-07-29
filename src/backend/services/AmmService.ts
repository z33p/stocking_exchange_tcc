import { TOKEN_SWAP_PROGRAM_ID, TokenSwap, CurveType } from "../../token_swap";
// import { TOKEN_SWAP_PROGRAM_ID, TokenSwap, CurveType } from "@solana/spl-token-swap";
import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import { PublicKey, Account, Connection, Keypair, ConfirmOptions } from "@solana/web3.js";
import NativeAccountData from "../data/NativeAccountData";
import SplTokenData from "../data/SplTokenData";
import SwapTokenAmmData from "../data/SwapTokenAmmData";
import SplToken from "../../domain/entities/SplToken";
import SolanaService from "./SolanaService";
import TokenTypeEnum from "../../domain/enums/TokenTypeEnum";

// Pool fees
const TRADING_FEE_NUMERATOR = 25;
const TRADING_FEE_DENOMINATOR = 10000;
const OWNER_TRADING_FEE_NUMERATOR = 5;
const OWNER_TRADING_FEE_DENOMINATOR = 10000;
const OWNER_WITHDRAW_FEE_NUMERATOR = 1;
const OWNER_WITHDRAW_FEE_DENOMINATOR = 6;
const HOST_FEE_NUMERATOR = 20;
const HOST_FEE_DENOMINATOR = 100;

async function createMintAmm(token: SplToken) {
  const conn = await SolanaService.establishConnection();
  const owner = await SolanaService.getPayer();

  const mintAuthority = token.mint_authority ? new PublicKey(token.mint_authority) : owner.publicKey;
  console.log(`MintAuth: ${mintAuthority}`);

  const tokenSwapAccount = new Account();
  NativeAccountData.insert({
    secret_key: tokenSwapAccount.secretKey.join(","),
    public_key: tokenSwapAccount.publicKey.toBase58()
  });
  console.log(`Created token swap native account ${tokenSwapAccount.publicKey.toBase58()}`);

  // bumpSeed aka nonce
  const [authority, _] = await PublicKey.findProgramAddress(
    [tokenSwapAccount.publicKey.toBuffer()],
    TOKEN_SWAP_PROGRAM_ID,
  );
  console.log(`Authority ${authority}`);

  console.log(`Creating AMM tokenPool`);
  const { mintPool, accountMintPool, feeAccountMintPool } = await createTokenPoolAndAccount(
    conn,
    owner,
    authority,
    owner.publicKey,
    token
  );

  console.log(`Creating tokenA`);
  const { mint: tokenA, mintAccount: accountTokenA } = await createMintAndAccount(
    conn,
    owner,
    token,
    mintAuthority,
    authority
  );

  token.name = `BRL - ${token.name}`;
  token.token_type = TokenTypeEnum.STABLECOIN;

  console.log(`Creating tokenB`);
  const { mint: tokenB, mintAccount: accountTokenB } = await createMintAndAccount(
    conn,
    owner,
    token,
    mintAuthority,
    authority
  );

  console.log(`Creating TokenSwap`);
  const tokenSwap = await TokenSwap.createTokenSwap(
    conn,
    new Account(owner.secretKey), // swapPayer,
    tokenSwapAccount,
    authority,
    accountTokenA,
    accountTokenB,
    mintPool.publicKey,
    tokenA.publicKey,
    tokenB.publicKey,
    feeAccountMintPool,
    accountMintPool,
    TOKEN_SWAP_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    TRADING_FEE_NUMERATOR,
    TRADING_FEE_DENOMINATOR,
    OWNER_TRADING_FEE_NUMERATOR,
    OWNER_TRADING_FEE_DENOMINATOR,
    OWNER_WITHDRAW_FEE_NUMERATOR,
    OWNER_WITHDRAW_FEE_DENOMINATOR,
    HOST_FEE_NUMERATOR,
    HOST_FEE_DENOMINATOR,
    CurveType.ConstantProduct,
  );

  SwapTokenAmmData.insert({
    address: tokenSwapAccount.publicKey.toBase58(),
    token_a_pk: tokenSwap.mintA.toBase58(),
    token_a_account_pk: accountTokenA.toBase58(),
    token_b_pk: tokenSwap.mintB.toBase58(),
    token_b_account_pk: accountTokenB.toBase58(),
  });

  console.log(`Creating TokenSwap AMM created!`);
}

async function createTokenPoolAndAccount(
  conn: Connection,
  payer: Keypair,
  authority: PublicKey,
  owner: PublicKey,
  token: SplToken
) {
  const mintPool = await Token.createMint(
    conn,
    payer,
    authority,
    null,
    2,
    TOKEN_PROGRAM_ID
  );
  console.log(`Token Pool created ${mintPool.publicKey.toBase58()}`);

  SplTokenData.insert({
    name: `${token.name} POOL`,
    address: mintPool.publicKey.toBase58(),
    mint_authority: authority.toBase58(),
    freeze_authority: null,
    token_type: TokenTypeEnum.TOKEN_POOL,
    supply: BigInt(0)
  });

  console.log("Token Pool account and fee account");
  const accountMintPoolPromise = mintPool.createAccount(owner);
  const feeAccountMintPoolPromise = mintPool.createAccount(owner);

  const res = {
    mintPool,
    accountMintPool: await accountMintPoolPromise,
    feeAccountMintPool: await feeAccountMintPoolPromise
  }

  return res;
}

async function createMintAndAccount(
  conn: Connection,
  owner: Keypair,
  token: SplToken,
  mintAuthority: PublicKey,
  accountAuthority: PublicKey
) {
  const mint = await Token.createMint(
    conn,
    owner,
    mintAuthority,
    token.freeze_authority ? new PublicKey(token.freeze_authority) : null,
    2,
    TOKEN_PROGRAM_ID
  );

  token.address = mint.publicKey.toBase58();

  SplTokenData.insert(token);

  const mintAccount = await mint.createAccount(accountAuthority);
  const userAccount = await mint.createAssociatedTokenAccount(owner.publicKey);

  await Promise.all([
    mint.mintTo(mintAccount, owner, [], Number(token.supply)),
    mint.mintTo(userAccount, owner, [], Number(token.supply))
  ]);

  return { mint, mintAccount };
}

async function loadTokenSwapByToken(splTokenA: SplToken) {
  const swapTokenAmm = SwapTokenAmmData.findByToken(splTokenA);

  const conn = await SolanaService.establishConnection();
  const owner = await SolanaService.getPayer();

  const fetchedTokenSwap = await TokenSwap.loadTokenSwap(
    conn,
    new PublicKey(swapTokenAmm.address),
    TOKEN_SWAP_PROGRAM_ID,
    new Account(owner.secretKey),
  );

  return fetchedTokenSwap;
}

async function swap(splTokenA: SplToken, swapAmount: bigint) {
  const tokenSwap = await loadTokenSwapByToken(splTokenA);

  const conn = await SolanaService.establishConnection();
  const owner = await SolanaService.getPayer();

  const tokenA = new Token(conn, tokenSwap.mintA, TOKEN_PROGRAM_ID, owner);
  const tokenB = new Token(conn, tokenSwap.mintB, TOKEN_PROGRAM_ID, owner);

  console.log("Users account getting...");
  const [accountUserA, accountUserB] = await Promise.all([
    tokenA.getOrCreateAssociatedAccountInfo(owner.publicKey),
    tokenB.getOrCreateAssociatedAccountInfo(owner.publicKey)
  ]);

  const mintPool = new Token(conn, tokenSwap.poolToken, TOKEN_PROGRAM_ID, owner);

  console.log("Fee account creating...");
  const feeAccountPoolSwap = await mintPool.createAccount(owner.publicKey)

  console.log("Creating throwaway account");
  const userTransferAuthority = new Account();
  await tokenA.approve(
    accountUserA.address,
    userTransferAuthority.publicKey,
    owner,
    [],
    Number(swapAmount),
  );

  const confirmOptions: ConfirmOptions = {
    skipPreflight: false
  }

  console.log("Getting pool tokens account A and B");
  console.log(tokenSwap.tokenAccountA.toBase58());
  console.log(tokenSwap.tokenAccountB.toBase58());

  const [accountTokenA, accountTokenB] = await Promise.all([
    tokenA.getAccountInfo(tokenSwap.tokenAccountA),
    tokenB.getAccountInfo(tokenSwap.tokenAccountB)
  ]);

  console.log('Swapping');
  if (splTokenA.token_type === TokenTypeEnum.COIN)
    await tokenSwap.swap(
      accountUserA.address,
      accountTokenA.address,
      accountTokenB.address,
      accountUserB.address,
      feeAccountPoolSwap,
      userTransferAuthority,
      Number(swapAmount),
      1,
      confirmOptions
    );
  else
    await tokenSwap.swap(
      accountTokenB.address,
      accountUserB.address,
      accountUserA.address,
      accountTokenA.address,
      feeAccountPoolSwap,
      userTransferAuthority,
      Number(swapAmount),
      1,
      confirmOptions
    );
  console.log('Swapped');
}

const AmmService = {
  createMintAmm,
  loadFirstTokenSwapByTokenA: loadTokenSwapByToken,
  swap
};

export default AmmService;
