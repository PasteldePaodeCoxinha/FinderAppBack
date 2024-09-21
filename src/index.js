require('dotenv').config({path: `${__dirname}\\env`});
const express = require("express");
const cors = require("cors");

const Usuario = require("./rotas/usuario")

const PORT = 3001;

const app = express()

app.use(require("body-parser").urlencoded({ extended: false }));
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