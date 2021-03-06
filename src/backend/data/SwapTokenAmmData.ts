import SplToken from "../../domain/entities/SplToken";
import SwapTokenAmm from "../../domain/entities/SwapTokenAmm";
import TokenTypeEnum from "../../domain/enums/TokenTypeEnum";
import { database } from "./DataConnection";

function findByToken(token: SplToken) {
  const tokenPkColumn = token.token_type === TokenTypeEnum.COIN
    ? "token_a_pk"
    : "token_b_pk";

    const stmt = database
        .prepare("SELECT * FROM tb_swap_token_amm tsta " +
            `WHERE ${tokenPkColumn} = '${token.address}' ORDER BY 1 LIMIT 1`);

    return stmt.get() as SwapTokenAmm;
}

function getAllWithLimit(params: {
    limit: number;
}): SwapTokenAmm[] {
    const stmt = database
        .prepare("SELECT * FROM tb_swap_token_amm ORDER BY 1 LIMIT :limit");

    return stmt.all(params) as SwapTokenAmm[];

}

function getAllPaginated(params: {
    limit: number;
    offset: number
}): SwapTokenAmm[] {
    const stmt = database
        .prepare("SELECT * FROM tb_swap_token_amm ORDER BY 1 LIMIT :limit OFFSET :offset");

    return stmt.all(params) as SwapTokenAmm[];
}

function insert(swapTokenAmm: SwapTokenAmm) {
    const sql = `INSERT INTO tb_swap_token_amm VALUES(
        '${swapTokenAmm.address}',
        '${swapTokenAmm.token_a_pk}',
        '${swapTokenAmm.token_a_account_pk}',
        '${swapTokenAmm.token_b_pk}',
        '${swapTokenAmm.token_b_account_pk}'
    )`;

    const stmt = database.prepare(sql);

    stmt.run(swapTokenAmm);
}

const SwapTokenAmmData = {
    findByToken,
    getAllWithLimit,
    getAllPaginated,
    insert
}

export default SwapTokenAmmData;