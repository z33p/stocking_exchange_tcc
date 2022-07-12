import Database from "better-sqlite3";

function openDatabase() {
    const db = new Database("data/db.sqlite", {
        fileMustExist: false,
        verbose: console.log
    });
    
    return db;
}

export const database = openDatabase();
