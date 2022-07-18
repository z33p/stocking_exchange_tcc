interface Token {
    name: string;
    description: string;
    supply: number;
    address: string | null;
    mintAuthority: string | null;
    freezeAuthority: string | null
}