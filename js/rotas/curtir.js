"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const database_1 = require("../config/database");
//
// POST
router.post("/cadastro", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const curtiu = req.body.curtiu;
    const curtido = req.body.curtido;
    const conn = yield (0, database_1.OpenConnection)();
    try {
        yield conn.query(`INSERT INTO curtir (curtiu, curtido) 
                VALUES ('${curtiu}', '${curtido}')`);
        res.status(200).json({ msg: "Cadastrado" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
    finally {
        (0, database_1.CloseConnection)(conn);
    }
}));
module.exports = router;
