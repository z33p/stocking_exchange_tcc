import { PublicKey } from "@solana/web3.js";
import SplTokenData from "../../backend/data/SplTokenData";
import AccountService from "../../backend/services/AccountService";
import SolanaService from "../../backend/services/SolanaService";
import SplToken from "../entities/SplToken";
import IAccountDto from "./Dto/IAccountDto";

async function getTokenAccount(tokenPk: string, accountPk: string) : Promise<IAccountDto> {
    const conn = await SolanaService.establishConnection()
    const owner = await SolanaService.getPayer();

    const accountInfo = await AccountService.getAccount(
        conn,
        owner,
        new PublicKey(tokenPk),
        new PublicKey(accountPk)
    );

    const account = {
        tokenName: "",
        address: accountInfo.address.toBase58(),
        balance: accountInfo.amount.toBuffer().readBigUInt64LE(),
    }

    return account;
}

async function getTokenAccountFromOwner(tokenPk: string) : Promise<IAccountDto> {
    const conn = await SolanaService.establishConnection()
    const owner = await SolanaService.getPayer();

    const accountInfo = await AccountService.getAssociatedAccount(
        conn,
        owner,
        new PublicKey(tokenPk)
    );

    const account = {
        tokenName: "",
        address: accountInfo.address.toBase58(),
        balance: accountInfo.amount.toBuffer().readBigUInt64LE(),
    }

    return account;
}


async function getAllWithLimit(params: { limit: number }) {
    const tokens = SplTokenData.getAllWithLimit(params);

    const conn = await SolanaService.establishConnection();
    const userKeyPair = await SolanaService.getPayer();

    const accounts = await Promise.all(tokens.map(async (token: SplToken): Promise<IAccountDto> => {
        const splTokenAccount = await AccountService.getAssociatedAccount(
            conn,
            userKeyPair,
            new PublicKey(token.address)
        );

        const tokenAccount = {
            tokenName: token.name,
            balance: splTokenAccount.amount.toBuffer().readBigUInt64LE(),
            address: splTokenAccount.address.toBase58()
        };

        return tokenAccount;
    }));

    return accounts;
}

const AccountBusiness = {
    getAllWithLimit,
    getTokenAccountFromOwner,
    getTokenAccount
};

export default AccountBusiness;
