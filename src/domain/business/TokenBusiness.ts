import SplTokenData from "../../backend/data/SplTokenData";
import MintTokenService from "../../backend/services/MintTokenService";
import SplToken from "../entities/SplToken";

function getAllWithLimit(params: { limit: number }) {
    return SplTokenData.getAllWithLimit(params);
}

async function mintToken(token: SplToken) {
    token = await MintTokenService.createToken(token);
    SplTokenData.insert(token)

    console.log("Token minted and inserted in database successfully")
}

const TokenBusiness = {
    getAllWithLimit,
    mintToken
};

export default TokenBusiness;
