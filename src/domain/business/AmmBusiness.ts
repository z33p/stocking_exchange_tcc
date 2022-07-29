import SwapTokenAmmData from "../../backend/data/SwapTokenAmmData";
import AmmService from "../../backend/services/AmmService";
import SplToken from "../entities/SplToken";

function findByToken(token: SplToken) {
    return SwapTokenAmmData.findByToken(token);
}

async function swap(tokenA: SplToken, swapAmount: bigint) {
  try {
    await AmmService.swap(tokenA, swapAmount);
  } catch (error: any) {
    if (error.logs)
      error.logs.forEach((log: any) => console.log(log));
    else
      console.log(error);
  }
}

const AmmBusiness = {
  findByToken,
  swap
};

export default AmmBusiness;
