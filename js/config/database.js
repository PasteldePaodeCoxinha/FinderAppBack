"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenConnection = OpenConnection;
exports.CloseConnection = CloseConnection;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pg_1 = __importDefault(require("pg"));
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
function OpenConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        const pool = new pg_1.default.Pool({
            host: PGHOST,
            database: PGDATABASE,
            user: PGUSER,
            password: PGPASSWORD,
            port: 5432,
            ssl: true
        });
        const client = yield pool;
        return client;
    });
}
function CloseConnection(conn) {
    conn.end();
}
