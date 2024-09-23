const express = require("express");
const router = express.Router();
const { OpenConnection, CloseConnection } = require("../config/database")

//
// POST
router.post(
    "/cadastro",
    async (req, res) => {
        const conn = await OpenConnection()

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
            
            res.status(200).json({id: idUsuario, msg: "Cadastrado" })
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: error })
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

            res.status(200).json({msg: "Associado"})
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: error })
        } finally {
            CloseConnection(conn)
        }
    }
)

//
// GERT
router.get(
    "/lista",
    async (req, res) => {
        const conn = await OpenConnection()
        try {
            const query = await conn.query(`SELECT * FROM usuario;`)
            res.status(200).json({ usuarios: query["rows"] })
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: error })
        } finally {
            CloseConnection(conn)
        }
    }
)

module.exports = router