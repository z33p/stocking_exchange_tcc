import TokenTypeEnum from "../enums/TokenTypeEnum";

export default interface SplToken {
    name: string;
    supply: bigint;
    address: string;
    mint_authority: string;
    freeze_authority: string | null;
    token_type: TokenTypeEnum;
}