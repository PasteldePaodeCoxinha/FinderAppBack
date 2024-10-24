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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const database_1 = require("../config/database");
//
// POST
router.post("/cadastro", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const curtiu = req.body.curtiu;
    const curtido = req.body.curtido;
    const conn = yield (0, database_1.OpenConnection)();
    try {
        yield conn.query(`INSERT INTO curtir (curtiu, curtido) VALUES ('${curtiu}', '${curtido}')`);
        const curtir = (yield conn.query(`SELECT curtiu, curtido FROM curtir WHERE curtiu=${curtiu} AND curtido=${curtido}`))["rows"][0];
        res.status(200).json({ curtir: curtir, msg: "Cadastrado" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
    finally {
        (0, database_1.CloseConnection)(conn);
    }
}));
//
// GET
router.get("/match", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const curtiu = req.query.curtiu;
    const curtido = req.query.curtido;
    const conn = yield (0, database_1.OpenConnection)();
    try {
        const match = (yield conn.query(`SELECT * FROM curtir WHERE curtiu=${curtido} AND curtido=${curtiu}`))["rows"];
        if (match.length > 0) {
            res.status(200).json({ msg: "Match encontrado" });
        }
        else {
            res.status(204).json({ msg: "Nenhum match" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
    finally {
        (0, database_1.CloseConnection)(conn);
    }
}));
router.get("/listaMatch", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarioId = req.query.usuarioId;
    const conn = yield (0, database_1.OpenConnection)();
    try {
        const matches = (yield conn.query(`SELECT DISTINCT u.id, u.nome, u.imgperfil FROM usuario AS u JOIN curtir AS c ON u.id = c.curtido WHERE c.curtiu = ${usuarioId} AND c.curtido IN (SELECT cur.curtiu FROM curtir AS cur WHERE cur.curtido = ${usuarioId})`))["rows"];
        if (matches.length > 0) {
            res.status(200).json({ matches: matches, msg: "Lista de matches encontrado" });
        }
        else {
            res.status(204).json({ msg: "Nenhum match encontrado" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
    finally {
        (0, database_1.CloseConnection)(conn);
    }
}));
module.exports = router;
