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
router.post("/cadastrar", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const numero_casa = req.body.numero_casa;
    const rua = req.body.rua;
    const bairro = req.body.bairro;
    const cidade = req.body.cidade;
    const estado = req.body.estado;
    const regiao = req.body.regiao;
    const cep = req.body.cep;
    const longi = req.body.longi;
    const lati = req.body.lati;
    const usuario_id = req.body.usuario_id;
    const conn = yield (0, database_1.OpenConnection)();
    try {
        yield conn.query(`INSERT INTO localizacao(numero_casa, rua, bairro, cidade, estado, regiao, cep, longi, lati, usuario_id) VALUES(${numero_casa}, '${rua}', '${bairro}', '${cidade}', '${estado}', '${regiao}', '${cep}', ${longi}, ${lati}, ${usuario_id})`);
        res.status(200).json({ msg: "Criado" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
    finally {
        (0, database_1.CloseConnection)(conn);
    }
}));
router.get("/lista", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idUsuario = req.query.idUsuario;
    const conn = yield (0, database_1.OpenConnection)();
    try {
        const localizacao = (yield conn.query(`SELECT * FROM localizacao WHERE usuario_id = ${idUsuario}`))["rows"];
        if (localizacao.length <= 0) {
            res.status(404).json({ msg: "Localização não encontrada" });
        }
        else {
            res.status(200).json({ localizacao: localizacao[0], msg: "Localização encontrada" });
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
