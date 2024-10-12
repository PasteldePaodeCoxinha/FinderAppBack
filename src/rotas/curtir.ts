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

            res.status(200).json({curtir: curtir, msg: "Cadastrado" })
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
            const match = (await conn.query(`SELECT * FROM curtir WHERE curtiu=${curtiu} AND curtido=${curtido}`))["rows"]
            
            if (match.length > 0) {
                res.status(200).json({msg: "Match encontrado"})
            } else {
                res.status(204).json({msg: "Nenhum match"})
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