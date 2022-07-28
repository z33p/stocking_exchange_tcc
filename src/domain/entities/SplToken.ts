export default interface SplToken {
    name: string;
    supply: bigint;
    address: string;
    mint_authority: string;
    freeze_authority: string | null;
    is_swap_pool: boolean;
}