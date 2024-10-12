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
            await conn.query(`INSERT INTO curtir (curtiu, curtido) 
                VALUES ('${curtiu}', '${curtido}')`)

            res.status(200).json({msg: "Cadastrado" })
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: (error as Error).message })
        } finally {
            CloseConnection(conn)
        }
    }
)

module.exports = router