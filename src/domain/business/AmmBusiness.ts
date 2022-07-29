import SwapTokenAmmData from "../../backend/data/SwapTokenAmmData";
import AmmService from "../../backend/services/AmmService";

function findByTokenA(token_a_pk: string) {
    const swapTokenAmm = SwapTokenAmmData.findByTokenA(token_a_pk);
    return swapTokenAmm;
}

async function loadSplTokenSwap(token_a_pk: string) {
    const tokenSwap = await AmmService.loadFirstTokenSwapByTokenA(token_a_pk);
    return tokenSwap;
}

async function swap(token_a_pk: string, swapAmount: bigint) {
    try {
        await AmmService.swap(token_a_pk, swapAmount);
    } catch (error : any) {
        if (error.logs)
            error.logs.forEach((log: any) => console.log(log));
        else
            console.log(error);
    }
}

const AmmBusiness = {
    loadSplTokenSwap,
    findByTokenA,
    swap
};

export default AmmBusiness;
