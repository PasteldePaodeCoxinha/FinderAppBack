require('dotenv').config({ path: `${__dirname}\\env` });
import express from "express"
const cors = require("cors");

const Usuario = require("./rotas/usuario")
const Gosto = require("./rotas/gosto")
const Interesse = require("./rotas/interesse")
const Curtir = require("./rotas/curtir")
const Chat = require("./rotas/chat")
const Mensagem = require("./rotas/mensagem")

const PORT = process.env.PORT || 3001;

const app = express()

app.use(require("body-parser").urlencoded({ extended: false }));
app.use(express.json({limit: '57mb'}));
app.use(express.urlencoded({limit: '57mb'}));
app.use(
    cors({
        origin: "*",
        method: ["GET", "POST"]
    })
);
app.use(express.json());

app.listen(PORT, () => {
    console.log("A aplicação está rodando na porta " + PORT);
})

app.use("/usuario", Usuario)
app.use("/gosto", Gosto)
app.use("/interesse", Interesse)
app.use("/curtir", Curtir)
app.use("/chat", Chat)
app.use("/mensagem", Mensagem)