interface Token {
    name: string;
    supply: number;
    address: string | null;
    mint_authority: string | null;
    freeze_authority: string | null
}