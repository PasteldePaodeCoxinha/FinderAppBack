import express from "express"
const router = express.Router();
import { OpenConnection, CloseConnection } from "../config/database"

router.post(
    "/cadastrar",
    async (req, res) => {
        const numero_casa = req.body.numero_casa
        const rua = req.body.rua
        const bairro = req.body.bairro
        const cidade = req.body.cidade
        const estado = req.body.estado
        const regiao = req.body.regiao
        const cep = req.body.cep
        const longi = req.body.longi
        const lati = req.body.lati

        const conn = await OpenConnection()
        try {
            conn.query(`INSERT INTO localizacao(numero_casa, rua, bairro, cidade, estado, regiao, cep, longi, lati) VALUES(${numero_casa}, '${rua}', '${bairro}', '${cidade}', '${estado}', '${regiao}', '${cep}', ${longi}, ${lati})`)
            res.status(200).json({ msg: "Criado" })
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: (error as Error).message })
        } finally {
            CloseConnection(conn)
        }
    }
)

router.get(
    "/lista",
    async (req, res) => {
        const id = req.query.id

        const conn = await OpenConnection()
        try {
            const localizacao = (await conn.query(`SELECT * FROM localizacao WHERE id = ${id}`))["rows"]
            if (localizacao.length > 0) {
                res.status(200).json({ localizacao: localizacao[0], msg: "Localização encontrada" })
            } else {
                res.status(204).json({ msg: "Localização não encontrada" })
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