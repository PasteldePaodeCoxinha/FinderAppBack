import express from "express"
const router = express.Router();
import { OpenConnection, CloseConnection } from "../config/database"

//
// POST
router.post(
    "/cadastro",
    async (req, res) => {
        const nome = req.body.nome
        const email = req.body.email
        const senha = req.body.senha
        const datanascimento = req.body.datanascimento
        const profissao = req.body.profissao
        const escolaridade = req.body.escolaridade
        const descricao = req.body.descricao
        const imgperfil = req.body.imgperfil

        const conn = await OpenConnection()
        try {
            const emailVeri = await conn.query(`SELECT email FROM usuario WHERE email = '${email}'`)

            if (emailVeri.rows.length > 0) {
                res.status(400).json({msg: "Esse email já existe!"})
                return
            }

            await conn.query(`INSERT INTO usuario (nome, email, senha, datanascimento, profissao, escolaridade, descricao, imgperfil) 
                VALUES ('${nome}', '${email}', '${senha}', '${datanascimento}', '${profissao}', '${escolaridade}', '${descricao}', '${imgperfil}')`)

            const idUsuario = await conn.query(`SELECT id FROM usuario WHERE nome = '${nome}'`)

            res.status(200).json({ id: idUsuario["rows"][0].id, msg: "Cadastrado" })
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: (error as Error).message })
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
            res.status(500).json({ msg: (error as Error).message })
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
                id = v as number
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
                res.status(500).json({ msg: (error as Error).message })
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
            const query = await conn.query(`SELECT * FROM usuario`)
            res.status(200).json({ usuarios: query["rows"] })
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: (error as Error).message })
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
            res.status(500).json({ msg: (error as Error).message })
        } finally {
            CloseConnection(conn)
        }
    }
)

router.get(
    "/getUmUsuario",
    async (req, res) => {
        const conn = await OpenConnection()

        const id = req.query.id

        try {
            const queRes = await conn.query(`SELECT * FROM usuario WHERE id=${id}`)
            const usuario = queRes["rows"]

            if (usuario.length <= 0) {
                res.status(404).json({ msg: "Esse usuário não existe!" })
            } else if (usuario.length === 1) {
                res.status(200).json({ idUsuario: usuario[0], msg: "Usuário encontrado" })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: (error as Error).message })
        } finally {
            CloseConnection(conn)
        }
    }
)

module.exports = router