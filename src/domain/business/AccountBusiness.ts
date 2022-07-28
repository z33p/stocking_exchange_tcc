import { PublicKey } from "@solana/web3.js";
import SplTokenData from "../../backend/data/SplTokenData";
import AccountService from "../../backend/services/AccountService";
import SolanaService from "../../backend/services/SolanaService";
import SplToken from "../entities/SplToken";
import IAccountDto from "./Dto/IAccountDto";


async function getAllWithLimit(params: { limit: number }) {
    const tokens = SplTokenData.getAllWithLimit(params);

    const conn = await SolanaService.establishConnection();
    const userKeyPair = await SolanaService.getPayer();

    const accounts = await Promise.all(tokens.map(async (token: SplToken): Promise<IAccountDto> => {
        const solanaTokenAccount = await AccountService.getAccount(
            conn,
            userKeyPair,
            new PublicKey(token.address)
        );

        const tokenAccount = {
            tokenName: token.name,
            balance: solanaTokenAccount.amount,
            address: solanaTokenAccount.address.toBase58()
        };

        console.table(solanaTokenAccount);
        console.table(tokenAccount);

        return tokenAccount;
    }));

    return accounts;
}

const AccountBusiness = {
    getAllWithLimit
};

export default AccountBusiness;
