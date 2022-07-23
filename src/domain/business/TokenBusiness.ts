import TokenData from "../../backend/data/TokenData";
import MintTokenService from "../../backend/services/MintTokenService";

function getAllWithLimit(params: { limit: number }) {
    return TokenData.getAllWithLimit(params);
}

async function mintToken(token: Token) {
    token = await MintTokenService.createToken(token);
    TokenData.insert(token)

    console.log("Token minted and inserted in database successfully")
}

const TokenBusiness = {
    getAllWithLimit,
    mintToken
};

export default TokenBusiness;
