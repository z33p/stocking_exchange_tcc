import SplToken from "../../domain/entities/SplToken";
import TokenTypeEnum from "../../domain/enums/TokenTypeEnum";
import { database } from "./DataConnection";

function getAllWithLimit(params: {
    limit: number;
}): SplToken[] {
    const stmt = database
        .prepare(`SELECT * FROM tb_spl_token WHERE token_type<>${TokenTypeEnum.TOKEN_POOL} ORDER BY rowid LIMIT :limit`);

    return stmt.all(params) as SplToken[];

}

function getAllPaginated(params: {
    limit: number;
    offset: number
}): SplToken[] {
    const stmt = database
        .prepare("SELECT * FROM tb_spl_token ORDER BY 1 LIMIT :limit OFFSET :offset");

    return stmt.all(params) as SplToken[];
}

function insert(token: SplToken) {
    const sql = `INSERT INTO tb_spl_token VALUES(
        :name,
        :supply,
        '${token.address}',
        '${token.mint_authority}',
        '${token.freeze_authority}',
        ${token.token_type}
    )`;

    const stmt = database.prepare(sql);

    stmt.run(token);
}

const SplTokenData = {
    getAllWithLimit,
    getAllPaginated,
    insert
}

export default SplTokenData;