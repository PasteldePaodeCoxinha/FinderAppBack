const express = require("express");
const router = express.Router();
const { OpenConnection, CloseConnection } = require("../config/database")

//
// POST
router.post(
    "/cadastro",
    async (req, res) => {
        const conn = await OpenConnection()

        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        
        console.log(req.body);

        const nome = req.body.nome
        const email = req.body.email
        const senha = req.body.senha
        const datanascimento = req.body.datanascimento
        const profissao = req.body.profissao
        const escolaridade = req.body.escolaridade
        const descricao = req.body.descricao

        try {
            await conn.query(`INSERT INTO usuario (nome, email, senha, datanascimento, profissao, escolaridade, descricao) 
                VALUES ('${nome}', '${email}', '${senha}', '${datanascimento}', '${profissao}', '${escolaridade}', '${descricao}')`)

            const idUsuario = await conn.query(`SELECT id FROM usuario WHERE nome = '${nome}'`)

            res.status(200).json({ id: idUsuario["rows"], msg: "Cadastrado" })
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: error.message })
        } finally {
            CloseConnection(conn)
        }
    }
)

router.post(
    "/associarInteGos",
    async (req, res) => {
        const conn = await OpenConnection()

        const usuario = req.body.usuario
        const gostos = req.body.gostos
        const interesses = req.body.interesses

        try {
            let gostosIds = []
            let intereIds = []

            if (gostos) {
                const listaGostos = "'" + gostos.join("','") + "'"
                const gostosQuery = await conn.query(`SELECT id FROM gosto WHERE nome IN (${listaGostos});`)
                gostosIds = gostosQuery["rows"].map(g => g.id)
            }
            if (interesses) {
                const listaInteresses = "'" + interesses.join("','") + "'"
                const interessesQuery = await conn.query(`SELECT id FROM interesse WHERE nome IN (${listaInteresses});`)
                intereIds = interessesQuery["rows"].map(g => g.id)
            }

            if (gostosIds.length > 0) {
                const query = `(${usuario},` + gostosIds.join(`),(${usuario},`) + `)`

                await conn.query(`INSERT INTO gostoUsuario(usuario_id, gostos_id) VALUES ${query};`)
            }

            if (intereIds.length > 0) {
                const query = `(${usuario},` + intereIds.join(`),(${usuario},`) + `)`

                await conn.query(`INSERT INTO interesseUsuario(usuario_id, interesse_id) VALUES ${query};`)
            }

            res.status(200).json({ msg: "Associado" })
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: error.message })
        } finally {
            CloseConnection(conn)
        }
    }
)

router.post(
    "/editar",
    async (req, res) => {
        const conn = await OpenConnection()

        let query = []
        let id = 0

        for (const [k, v] of Object.entries(req.body)) {
            if (k == "id") {
                id = v
            } else {
                query.push(`${k} = '${v}'`)
            }
        }

        const queryFormated = query.join(",")

        if (!queryFormated) {
            res.status(400).json({ msg: "Nenhum valor enviado para edição" })
        } else {
            try {
                await conn.query(`UPDATE usuario SET ${queryFormated} WHERE id = ${id}`)
                res.status(200).json({ msg: "Usuario editado" })
            } catch (error) {
                console.log(error);
                res.status(500).json({ msg: error.message })
            } finally {
                CloseConnection(conn)
            }
        }
    }
)

//
// GET
router.get(
    "/lista",
    async (req, res) => {
        const conn = await OpenConnection()
        try {
            const query = await conn.query(`SELECT * FROM usuario;`)
            res.status(200).json({ usuarios: query["rows"] })
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: error.message })
        } finally {
            CloseConnection(conn)
        }
    }
)

router.get(
    "/login",
    async (req, res) => {
        const conn = await OpenConnection()

        const email = req.query.email
        const senha = req.query.senha

        try {
            const queRes = await conn.query(`SELECT id FROM usuario WHERE email='${email}' AND senha='${senha}'`)
            const usuario = queRes["rows"]

            if (usuario.length <= 0) {
                res.status(404).json({ msg: "Email ou Senha incorretos" })
            } else if (usuario.length === 1) {
                res.status(200).json({ idUsuario: usuario[0].id, msg: "Usuário encontrado" })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: error.message })
        } finally {
            CloseConnection(conn)
        }
    }
)

module.exports = router