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
const bcrypt_1 = require("bcrypt");
function getInteresses(usuarioId) {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield (0, database_1.OpenConnection)();
        try {
            const queryInteresses = yield conn.query(`
                select i.id, i.nome
                    from interesseUsuario as iu
                        inner join interesse as i on iu.interesse_id = i.id
                    where usuario_id = ${usuarioId};`);
            const interesses = queryInteresses["rows"];
            return interesses;
        }
        catch (error) {
            console.log(error);
        }
        finally {
            (0, database_1.CloseConnection)(conn);
        }
        return [];
    });
}
function getGostos(usuarioId) {
    return __awaiter(this, void 0, void 0, function* () {
        const conn = yield (0, database_1.OpenConnection)();
        try {
            const queryGostos = yield conn.query(`
            select g.id, g.nome
                from gostoUsuario as gu
                    inner join gosto as g on gu.gostos_id = g.id
                where usuario_id = ${usuarioId};`);
            const gostos = queryGostos["rows"];
            return gostos;
        }
        catch (error) {
            console.log(error);
        }
        finally {
            (0, database_1.CloseConnection)(conn);
        }
        return [];
    });
}
//
// POST
router.post("/cadastro", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = yield (0, bcrypt_1.hash)(req.body.senha, 8);
    const datanascimento = req.body.datanascimento;
    const profissao = req.body.profissao;
    const escolaridade = req.body.escolaridade;
    const descricao = req.body.descricao;
    const imgperfil = req.body.imgperfil;
    const conn = yield (0, database_1.OpenConnection)();
    try {
        const emailVeri = yield conn.query(`SELECT email FROM usuario WHERE email = '${email}'`);
        if (emailVeri.rows.length > 0) {
            res.status(400).json({ msg: "Esse email já existe!" });
            return;
        }
        yield conn.query(`INSERT INTO usuario (nome, email, senha, datanascimento, profissao, escolaridade, descricao, imgperfil) 
                VALUES ('${nome}', '${email}', '${senha}', '${datanascimento}', '${profissao}', '${escolaridade}', '${descricao}', '${imgperfil}')`);
        const idUsuario = yield conn.query(`SELECT id FROM usuario WHERE nome = '${nome}'`);
        res.status(200).json({ id: idUsuario["rows"][0].id, msg: "Cadastrado" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
    finally {
        (0, database_1.CloseConnection)(conn);
    }
}));
router.post("/associarInteGos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield (0, database_1.OpenConnection)();
    const usuario = req.body.usuario;
    const gostos = req.body.gostos;
    const interesses = req.body.interesses;
    try {
        let gostosIds = [];
        let intereIds = [];
        if (gostos) {
            const listaGostos = "'" + gostos.join("','") + "'";
            const gostosQuery = yield conn.query(`SELECT id FROM gosto WHERE nome IN (${listaGostos});`);
            gostosIds = gostosQuery["rows"].map(g => g.id);
        }
        if (interesses) {
            const listaInteresses = "'" + interesses.join("','") + "'";
            const interessesQuery = yield conn.query(`SELECT id FROM interesse WHERE nome IN (${listaInteresses});`);
            intereIds = interessesQuery["rows"].map(g => g.id);
        }
        if (gostosIds.length > 0) {
            const query = `(${usuario},` + gostosIds.join(`),(${usuario},`) + `)`;
            yield conn.query(`INSERT INTO gostoUsuario(usuario_id, gostos_id) VALUES ${query};`);
        }
        if (intereIds.length > 0) {
            const query = `(${usuario},` + intereIds.join(`),(${usuario},`) + `)`;
            yield conn.query(`INSERT INTO interesseUsuario(usuario_id, interesse_id) VALUES ${query};`);
        }
        res.status(200).json({ msg: "Associado" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
    finally {
        (0, database_1.CloseConnection)(conn);
    }
}));
router.post("/editarInteGos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield (0, database_1.OpenConnection)();
    const usuario = req.body.usuario;
    const gostosAntigos = req.body.gostosAntigos;
    const gostos = req.body.gostos;
    const interessesAntigos = req.body.interessesAntigos;
    const interesses = req.body.interesses;
    try {
        let gostosIds = [];
        let intereIds = [];
        if (gostos) {
            const listaGostos = "'" + gostos.join("','") + "'";
            const gostosQuery = yield conn.query(`SELECT id FROM gosto WHERE nome IN (${listaGostos});`);
            gostosIds = gostosQuery["rows"].map(g => g.id);
        }
        if (interesses) {
            const listaInteresses = "'" + interesses.join("','") + "'";
            const interessesQuery = yield conn.query(`SELECT id FROM interesse WHERE nome IN (${listaInteresses});`);
            intereIds = interessesQuery["rows"].map(g => g.id);
        }
        if (gostosIds.length > 0) {
            const query = `(${usuario},` + gostosIds.join(`),(${usuario},`) + `)`;
            if (gostosAntigos != undefined && gostosAntigos.length > 0) {
                const listaGosAntigo = gostosAntigos.join(",");
                yield conn.query(`DELETE FROM gostoUsuario WHERE gostos_id in (${listaGosAntigo})`);
            }
            yield conn.query(`INSERT INTO gostoUsuario(usuario_id, gostos_id) VALUES ${query};`);
        }
        if (intereIds.length > 0) {
            const query = `(${usuario},` + intereIds.join(`),(${usuario},`) + `)`;
            if (interessesAntigos != undefined && interessesAntigos.length > 0) {
                const listaInteAntigo = interessesAntigos.join(",");
                yield conn.query(`DELETE FROM interesseUsuario WHERE interesse_id in (${listaInteAntigo})`);
            }
            yield conn.query(`INSERT INTO interesseUsuario(usuario_id, interesse_id) VALUES ${query};`);
        }
        res.status(200).json({ msg: "Editado" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
    finally {
        (0, database_1.CloseConnection)(conn);
    }
}));
router.post("/editar", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield (0, database_1.OpenConnection)();
    let query = [];
    let id = 0;
    for (const [k, v] of Object.entries(req.body)) {
        if (k == "id") {
            id = v;
        }
        else {
            query.push(`${k} = '${v}'`);
        }
    }
    const queryFormated = query.join(",");
    if (!queryFormated) {
        res.status(400).json({ msg: "Nenhum valor enviado para edição" });
    }
    else {
        try {
            yield conn.query(`UPDATE usuario SET ${queryFormated} WHERE id = ${id}`);
            res.status(200).json({ msg: "Usuario editado" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ msg: error.message });
        }
        finally {
            (0, database_1.CloseConnection)(conn);
        }
    }
}));
//
// GET
router.get("/lista", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarioId = req.query.usuarioId;
    const conn = yield (0, database_1.OpenConnection)();
    try {
        const queryUsuarios = yield conn.query(`SELECT * FROM usuario where visualizar = true;`);
        const usuarios = queryUsuarios["rows"];
        if (usuarioId == undefined) {
            res.status(200).json({ usuarios: queryUsuarios["rows"] });
            return;
        }
        const interessesUsuario = yield getInteresses(usuarioId);
        const gostosUsuario = yield getGostos(usuarioId);
        for (let i = 0; i < usuarios.length; i++) {
            const interesses = yield getInteresses(usuarios[i].id);
            const gostos = yield getGostos(usuarios[i].id);
            const interessesEmComum = interesses.map(i => i.id).filter(interesse => interessesUsuario.map(i => i.id).includes(interesse));
            const gostosEmComum = gostos.map(g => g.id).filter(gosto => gostosUsuario.map(g => g.id).includes(gosto));
            const pontos = interessesEmComum.length + gostosEmComum.length;
            usuarios[i].pontos = pontos;
        }
        res.status(200).json({ usuarios: usuarios.sort((a, b) => a.pontos - b.pontos) });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
    finally {
        (0, database_1.CloseConnection)(conn);
    }
}));
router.get("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.query.email;
    const senha = req.query.senha;
    const conn = yield (0, database_1.OpenConnection)();
    try {
        const queRes = yield conn.query(`SELECT id, senha FROM usuario WHERE email='${email}'`);
        const usuario = queRes["rows"];
        if (usuario.length > 0) {
            if (yield (0, bcrypt_1.compare)(senha, usuario[0].senha)) {
                res.status(200).json({ idUsuario: usuario[0].id, msg: "Usuário encontrado" });
            }
            else {
                res.status(400).json({ msg: "Senha incorreta" });
            }
        }
        else {
            res.status(404).json({ msg: "Email incorreto" });
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
router.get("/getUmUsuario", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    const conn = yield (0, database_1.OpenConnection)();
    try {
        const queRes = yield conn.query(`SELECT * FROM usuario WHERE id=${id}`);
        const usuario = queRes["rows"];
        if (usuario.length <= 0) {
            res.status(404).json({ msg: "Esse usuário não existe!" });
        }
        else if (usuario.length === 1) {
            res.status(200).json({ Usuario: usuario[0], msg: "Usuário encontrado" });
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
router.get(`/getInteressesUsuario`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarioId = req.query.usuarioId;
    const conn = yield (0, database_1.OpenConnection)();
    try {
        const queRes = yield conn.query(`select i.id, i.nome from interesseUsuario as iu inner join interesse as i on iu.interesse_id = i.id where usuario_id = ${usuarioId};`);
        const interesses = queRes["rows"];
        if (interesses.length <= 0) {
            res.status(404).json({ msg: "Esse usuário não tem interesses" });
        }
        else {
            res.status(200).json({ Interesses: interesses, msg: "Interesses encontrados" });
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
router.get(`/getGostosUsuario`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarioId = req.query.usuarioId;
    const conn = yield (0, database_1.OpenConnection)();
    try {
        const queRes = yield conn.query(`select g.id, g.nome from gostoUsuario as gu inner join gosto as g on gu.gostos_id = g.id where usuario_id = ${usuarioId};`);
        const gostos = queRes["rows"];
        if (gostos.length <= 0) {
            res.status(404).json({ msg: "Esse usuário não tem gostos" });
        }
        else {
            res.status(200).json({ Gostos: gostos, msg: "Gostos encontrados" });
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
