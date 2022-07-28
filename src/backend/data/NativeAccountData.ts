import NativeAccount from "../../domain/entities/NativeAccount";
import { database } from "./DataConnection";

function getAllWithLimit(params: {
    limit: number;
}): NativeAccount[] {
    const stmt = database
        .prepare("SELECT * FROM tb_native_account ORDER BY 1 LIMIT :limit");

    return stmt.all(params) as NativeAccount[];

}

function getAllPaginated(params: {
    limit: number;
    offset: number
}): NativeAccount[] {
    const stmt = database
        .prepare("SELECT * FROM tb_native_account ORDER BY 1 LIMIT :limit OFFSET :offset");

    return stmt.all(params) as NativeAccount[];
}

function insert(nativeAccount: NativeAccount) {
    const sql = `INSERT INTO tb_native_account VALUES(
        '${nativeAccount.secret_key}',
        '${nativeAccount.public_key}'
    )`;

    const stmt = database.prepare(sql);

    stmt.run(nativeAccount);
}

const NativeAccountData = {
    getAllWithLimit,
    getAllPaginated,
    insert
}

export default NativeAccountData;