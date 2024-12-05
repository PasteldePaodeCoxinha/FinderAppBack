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
router.post("/criarMsg", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const audMsg = req.body.audMsg == undefined ? null : req.body.audMsg;
    const textMsg = req.body.textMsg;
    const usuarioId = req.body.usuarioId;
    const chatId = req.body.chatId;
    const conn = yield (0, database_1.OpenConnection)();
    try {
        yield conn.query(`INSERT INTO mensagem(audMsg, textMsg, usuario_id, chat_id) VALUES ('${audMsg}', '${textMsg}', ${usuarioId}, ${chatId})`);
        res.status(200).json({ msg: "Mensagem enviada" });
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
router.get("/listaMsg", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = req.query.chatId;
    const conn = yield (0, database_1.OpenConnection)();
    try {
        const listaMsg = (yield conn.query(`SELECT * FROM mensagem WHERE chat_id = ${chatId}`))["rows"];
        if (listaMsg.length > 0) {
            res.status(200).json({ mensagens: listaMsg, msg: "Lista de mensagens encontrada" });
        }
        else {
            res.status(404).json({ msg: "Nenhuma mensagem encontrada" });
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
//
// GET
router.get("/novaMsg", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = req.query.chatId;
    const usuarioId = req.query.usuarioId;
    const conn = yield (0, database_1.OpenConnection)();
    try {
        const listaMsg = (yield conn.query(`SELECT * FROM mensagem join chat on chat.id = chat_id WHERE chat_id = ${chatId} and (idUsuario1 = ${usuarioId} or idUsuario2 = ${usuarioId}) and usuario_id != ${usuarioId}`))["rows"];
        if (listaMsg.length > 0) {
            res.status(200).json({ mensagens: listaMsg, msg: "Lista de mensagens encontrada" });
        }
        else {
            res.status(404).json({ msg: "Nenhuma mensagem encontrada" });
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
//
// GET
router.get("/marcarVisualizado", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = req.query.chatId;
    const usuarioId = req.query.usuarioId;
    const conn = yield (0, database_1.OpenConnection)();
    try {
        const listaMsg = (yield conn.query(`update mensagem set visualizado = true where chat_id = ${chatId} and usuario_id = ${usuarioId}`))["rows"];
        if (listaMsg.length > 0) {
            res.status(200).json({ mensagens: listaMsg, msg: "Mensagens marcadas como visualizadas" });
        }
        else {
            res.status(404).json({ msg: "Nenhuma mensagem encontrada" });
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
