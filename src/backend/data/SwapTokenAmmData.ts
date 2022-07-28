import SwapTokenAmm from "../../domain/entities/SwapTokenAmm";
import { database } from "./DataConnection";

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
        '${swapTokenAmm.token_b_pk}'
    )`;

    const stmt = database.prepare(sql);

    stmt.run(swapTokenAmm);
}

const SwapTokenAmmData = {
    getAllWithLimit,
    getAllPaginated,
    insert
}

export default SwapTokenAmmData;