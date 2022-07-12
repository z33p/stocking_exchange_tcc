import TokenData from "../../backend/data/TokenData";

function getAllWithLimit(limit: { limit: number }) {
    return TokenData.getAllWithLimit(limit);
}

function insert(token: Token) {
    return TokenData.insert(token);
}

const TokenBusiness = {
    getAllWithLimit,
    insert
};

export default TokenBusiness;