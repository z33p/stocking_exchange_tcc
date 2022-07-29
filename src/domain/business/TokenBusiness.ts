import SplTokenData from "../../backend/data/SplTokenData";
import AmmService from "../../backend/services/AmmService";
import SplToken from "../entities/SplToken";

function getAllWithLimit(params: { limit: number }) {
    return SplTokenData.getAllWithLimit(params);
}

async function mintToken(token: SplToken) {
    await AmmService.createMintAmm(token);
    console.log("Token minted and inserted in database successfully")
}

const TokenBusiness = {
    getAllWithLimit,
    mintToken
};

export default TokenBusiness;
