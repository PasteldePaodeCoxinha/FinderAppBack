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
router.post("/criarChat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idUsuario1 = req.body.idUsuario1;
    const idUsuario2 = req.body.idUsuario2;
    const conn = yield (0, database_1.OpenConnection)();
    try {
        yield conn.query(`INSERT INTO chat(idUsuario1, idUsuario2) VALUES (${idUsuario1}, ${idUsuario2})`);
        res.status(200).json({ msg: "Chat Criado" });
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
router.get("/listaChat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarioId = req.query.usuarioId;
    const conn = yield (0, database_1.OpenConnection)();
    try {
        const listaChat = (yield conn.query(`SELECT * FROM chat WHERE idUsuario1 = ${usuarioId} OR idUsuario2 = ${usuarioId}`))["rows"];
        if (listaChat.length > 0) {
            res.status(200).json({ chats: listaChat, msg: "Lista de chats encontrada" });
        }
        else {
            res.status(204).json({ msg: "Nenhum chat encontrado" });
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
router.get("/pegarUmChat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarioId1 = req.query.usuarioId1;
    const usuarioId2 = req.query.usuarioId2;
    const conn = yield (0, database_1.OpenConnection)();
    try {
        const listaChat = (yield conn.query(`SELECT * FROM chat WHERE (idUsuario1 = ${usuarioId1} OR idUsuario1 = ${usuarioId2}) AND (idUsuario2 = ${usuarioId1} OR idUsuario2 = ${usuarioId2})`))["rows"];
        if (listaChat.length > 0) {
            res.status(200).json({ chat: listaChat[0], msg: "Chat encontrado" });
        }
        else {
            res.status(204).json({ msg: "Nenhum chat encontrado" });
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
