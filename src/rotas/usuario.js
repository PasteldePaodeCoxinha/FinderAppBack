const express = require("express");
const router = express.Router();
const {OpenConnection, CloseConnection} = require("../config/database")

router.post(
    "/cadastro",
    async(req, res) => {
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
            res.status(200).json({msg: "Cadastrado"})
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: error })
        } finally {
            CloseConnection(conn)
        }
    }
)

router.get(
    "/lista",
    async(req, res) => {
        const conn = await OpenConnection()
        try {
            const query = await conn.query(`SELECT * FROM usuario;`)
            res.status(200).json({usuarios: query["rows"]})
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: error })
        } finally {
            CloseConnection(conn)
        }
    }
)

module.exports = router