import { database } from "./DataConnection";

function getAllWithLimit(params: {
    limit: number;
}): Token[] {
    const stmt = database
        .prepare("SELECT * FROM tb_token ORDER BY 1 LIMIT :limit");

    return stmt.all(params) as Token[];

}

function getAllPaginated(params: {
    limit: number;
    offset: number
}): Token[] {
    const stmt = database
        .prepare("SELECT * FROM tb_token ORDER BY 1 LIMIT :limit OFFSET :offset");

    return stmt.all(params) as Token[];
}

const TokenData = {
    getAllWithLimit,
    getAllPaginated
}

export default TokenData;