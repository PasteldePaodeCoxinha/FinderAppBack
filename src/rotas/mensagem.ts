import express from "express"
const router = express.Router();
import { OpenConnection, CloseConnection } from "../config/database"

//
// POST
router.post(
    "/criarMsg",
    async (req, res) => {
        const audMsg = req.body.audMsg
        const textMsg = req.body.textMsg
        const imgMsg = req.body.imgMsg
        const usuarioId = req.body.usuarioId
        const chatId = req.body.chatId

        const conn = await OpenConnection()
        try {
            let campos: Array<string> = [];
            let valores: Array<string> = [];
            if (audMsg && audMsg != undefined) {
                campos.push("audMsg");
                valores.push(`'${audMsg}'`);
            }
            if (textMsg && textMsg != undefined) {
                campos.push("textMsg");
                valores.push(`'${textMsg}'`);
            }
            if (imgMsg && imgMsg != undefined) {
                campos.push("imgMsg");
                valores.push(`'${imgMsg}'`);
            }

            await conn.query(`INSERT INTO mensagem(usuario_id, chat_id, ${campos.join(", ")}) VALUES (${usuarioId}, ${chatId}, ${valores.join(", ")})`)
            res.status(200).json({ msg: "Mensagem enviada" })
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
    "/listaMsg",
    async (req, res) => {
        const chatId = req.query.chatId

        const conn = await OpenConnection()
        try {
            const listaMsg = (await conn.query(`SELECT * FROM mensagem WHERE chat_id = ${chatId}`))["rows"]
            if (listaMsg.length > 0) {
                res.status(200).json({ mensagens: listaMsg, msg: "Lista de mensagens encontrada" })
            } else {
                res.status(404).json({ msg: "Nenhuma mensagem encontrada" })
            }
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
    "/novaMsg",
    async (req, res) => {
        const chatId = req.query.chatId;
        const usuarioId = req.query.usuarioId;

        const conn = await OpenConnection()
        try {
            const listaMsg = (await conn.query(`SELECT * FROM mensagem join chat on chat.id = chat_id WHERE chat_id = ${chatId} and (idUsuario1 = ${usuarioId} or idUsuario2 = ${usuarioId}) and usuario_id != ${usuarioId}`))["rows"]
            if (listaMsg.length > 0) {
                res.status(200).json({ mensagens: listaMsg, msg: "Lista de mensagens encontrada" })
            } else {
                res.status(404).json({ msg: "Nenhuma mensagem encontrada" })
            }
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
    "/marcarVisualizado",
    async (req, res) => {
        const chatId = req.query.chatId;
        const usuarioId = req.query.usuarioId;

        const conn = await OpenConnection()
        try {
            const listaMsg = (await conn.query(`update mensagem set visualizado = true where chat_id = ${chatId} and usuario_id = ${usuarioId}`))["rows"]
            if (listaMsg.length > 0) {
                res.status(200).json({ mensagens: listaMsg, msg: "Mensagens marcadas como visualizadas" })
            } else {
                res.status(404).json({ msg: "Nenhuma mensagem encontrada" })
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