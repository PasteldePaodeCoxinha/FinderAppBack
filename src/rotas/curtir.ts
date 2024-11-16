import express from "express"
const router = express.Router();
import { OpenConnection, CloseConnection } from "../config/database"

//
// POST
router.post(
    "/cadastro",
    async (req, res) => {
        const curtiu = req.body.curtiu
        const curtido = req.body.curtido

        const conn = await OpenConnection()
        try {
            await conn.query(`INSERT INTO curtir (curtiu, curtido) VALUES ('${curtiu}', '${curtido}')`)

            const curtir = (await conn.query(`SELECT curtiu, curtido FROM curtir WHERE curtiu=${curtiu} AND curtido=${curtido}`))["rows"][0]

            res.status(200).json({ curtir: curtir, msg: "Cadastrado" })
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: (error as Error).message })
        } finally {
            CloseConnection(conn)
        }
    }
)

//
// GET
router.get(
    "/match",
    async (req, res) => {
        const curtiu = req.query.curtiu
        const curtido = req.query.curtido

        const conn = await OpenConnection()
        try {
            const match = (await conn.query(`SELECT * FROM curtir WHERE curtiu=${curtido} AND curtido=${curtiu}`))["rows"]

            if (match.length > 0) {
                res.status(200).json({ msg: "Match encontrado" })
            } else {
                res.status(404).json({ msg: "Nenhum match" })
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
    "/listaMatch",
    async (req, res) => {
        const usuarioId = req.query.usuarioId

        const conn = await OpenConnection()
        try {
            const matches = (await conn.query(`SELECT DISTINCT u.id, u.nome, u.imgperfil FROM usuario AS u JOIN curtir AS c ON u.id = c.curtido WHERE c.curtiu = ${usuarioId} AND c.curtido IN (SELECT cur.curtiu FROM curtir AS cur WHERE cur.curtido = ${usuarioId})`))["rows"]
            if (matches.length > 0) {
                res.status(200).json({matches: matches, msg: "Lista de matches encontrado"})
            } else {
                res.status(404).json({msg: "Nenhum match encontrado"})
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