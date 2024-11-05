"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: `${__dirname}\\env` });
const express_1 = __importDefault(require("express"));
const cors = require("cors");
const Usuario = require("./rotas/usuario");
const Gosto = require("./rotas/gosto");
const Interesse = require("./rotas/interesse");
const Curtir = require("./rotas/curtir");
const Chat = require("./rotas/chat");
const Mensagem = require("./rotas/mensagem");
const Localizacao = require("./rotas/localizacao");
const PORT = process.env.PORT || 3001;
const app = (0, express_1.default)();
app.use(require("body-parser").urlencoded({ extended: false }));
app.use(express_1.default.json({ limit: '57mb' }));
app.use(express_1.default.urlencoded({ limit: '57mb' }));
app.use(cors({
    origin: "*",
    method: ["GET", "POST"]
}));
app.use(express_1.default.json());
app.listen(PORT, () => {
    console.log("A aplicação está rodando na porta " + PORT);
});
app.use("/usuario", Usuario);
app.use("/gosto", Gosto);
app.use("/interesse", Interesse);
app.use("/curtir", Curtir);
app.use("/chat", Chat);
app.use("/mensagem", Mensagem);
app.use("/localizacao", Localizacao);
