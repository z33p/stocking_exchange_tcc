export default interface ITokenDto {
    name: string;
    supply: bigint;
    address: string | null;
    mint_authority: string | null;
    freeze_authority: string | null
}
