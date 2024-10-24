import express from "express"
const router = express.Router();
import { OpenConnection, CloseConnection } from "../config/database"

//
// POST
router.post(
    "/criarMsg",
    async(req, res) => {
        const textMsg = req.body.textMsg
        const usuarioId = req.body.usuarioId
        const chatId = req.body.chatId

        const conn = await OpenConnection()
        try {
            await conn.query(`INSERT INTO mensagem(textMsg, usuario_id, chat_id) VALUES ('${textMsg}', ${usuarioId}, ${chatId})`)
            res.status(200).json({msg: "Mensagem enviada"})
        } catch (error) {
            console.log(error);
            res.status(500).json({msg: (error as Error).message})
        } finally {
            CloseConnection(conn)
        }
    }
)

//
// GET
router.get(
    "/listaMsg",
    async(req, res) => {
        const chatId = req.query.chatId

        const conn = await OpenConnection()
        try {
            const listaMsg = (await conn.query(`SELECT * FROM mensagem WHERE chat_id = ${chatId}`))["rows"]
            if (listaMsg.length > 0) {
                res.status(200).json({mensagens: listaMsg, msg:"Lista de mensagens encontrada"})
            } else {
                res.status(204).json({msg: "Nenhuma mensagem encontrada"})
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({msg: (error as Error).message})
        } finally {
            CloseConnection(conn)
        }
    }
)

module.exports = router