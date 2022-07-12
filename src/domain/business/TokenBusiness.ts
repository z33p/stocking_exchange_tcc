import TokenData from "../../backend/data/TokenData";

function getAllWithLimit(limit: { limit: number }) {
    return TokenData.getAllWithLimit(limit);
}

const TokenBusiness = {
    getAllWithLimit
};

export default TokenBusiness;