import express from "express"
const router = express.Router();
import { OpenConnection, CloseConnection } from "../config/database"

//
// POST
router.post(
    "/criarChat",
    async(req, res) => {
        const idUsuario1 = req.body.idUsuario1
        const idUsuario2 = req.body.idUsuario2

        const conn = await OpenConnection()
        try {
            await conn.query(`INSERT INTO chat(idUsuario1, idUsuario2) VALUES (${idUsuario1}, ${idUsuario2})`)
            res.status(200).json({msg: "Chat Criado"})
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
    "/listaChat",
    async(req, res) => {
        const usuarioId = req.query.usuarioId

        const conn = await OpenConnection()
        try {
            const listaChat = (await conn.query(`SELECT * FROM chat WHERE idUsuario1 = ${usuarioId} OR idUsuario2 = ${usuarioId}`))["rows"]
            if (listaChat.length > 0) {
                res.status(200).json({chats: listaChat, msg:"Lista de chats encontrada"})
            } else {
                res.status(204).json({msg: "Nenhum chat encontrado"})
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