interface Token {
    name: string;
    supply: bigint;
    address: string;
    mint_authority: string;
    freeze_authority: string | null
}