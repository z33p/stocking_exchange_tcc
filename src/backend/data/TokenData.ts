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

function insert(token: Token) {
    const sql = `INSERT INTO tb_token VALUES(
        :name,
        :description,
        :supply,
        '${token.address}',
        '${token.mintAuthority}',
        '${token.freezeAuthority}'
    )`;

    const stmt = database.prepare(sql);

    stmt.run(token);
}

const TokenData = {
    getAllWithLimit,
    getAllPaginated,
    insert
}

export default TokenData;