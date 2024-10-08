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
const PORT = process.env.PORT || 3001;
const app = (0, express_1.default)();
app.use(require("body-parser").urlencoded({ extended: false }));
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
