import express from "express"
const router = express.Router();
import { OpenConnection, CloseConnection } from "../config/database"
import { compare, hash } from "bcrypt";


async function getInteresses(usuarioId: number | string) {
    const conn = await OpenConnection();

    let interesses = [];
    try {
        const queryInteresses = await conn.query(`
                select i.id, i.nome
                    from interesseUsuario as iu
                        inner join interesse as i on iu.interesse_id = i.id
                    where usuario_id = ${usuarioId};`);
        interesses = queryInteresses["rows"];
    } catch (error) {
        console.log(error);
    } finally {
        CloseConnection(conn);
    }

    return interesses;
}

async function getGostos(usuarioId: number | string) {
    const conn = await OpenConnection();

    let gostos = [];
    try {
        const queryGostos = await conn.query(`
            select g.id, g.nome
                from gostoUsuario as gu
                    inner join gosto as g on gu.gostos_id = g.id
                where usuario_id = ${usuarioId};`);
        gostos = queryGostos["rows"];
    } catch (error) {
        console.log(error);
    } finally {
        CloseConnection(conn);
    }

    return gostos;
}

//
// POST
router.post(
    "/cadastro",
    async (req, res) => {
        const nome = req.body.nome
        const email = req.body.email
        const senha = await hash(req.body.senha as string, 8)
        const datanascimento = req.body.datanascimento
        const profissao = req.body.profissao
        const escolaridade = req.body.escolaridade
        const descricao = req.body.descricao
        const imgperfil = req.body.imgperfil

        const conn = await OpenConnection()
        try {
            const emailVeri = await conn.query(`SELECT email FROM usuario WHERE email = '${email}'`)

            if (emailVeri.rows.length > 0) {
                res.status(400).json({ msg: "Esse email já existe!" })
                return
            }

            await conn.query(`INSERT INTO usuario (nome, email, senha, datanascimento, profissao, escolaridade, descricao, imgperfil, visualizar) 
                VALUES ('${nome}', '${email}', '${senha}', '${datanascimento}', '${profissao}', '${escolaridade}', '${descricao}', '${imgperfil}', true)`)

            const idUsuario = await conn.query(`SELECT id FROM usuario WHERE nome = '${nome}'`)

            res.status(200).json({ id: idUsuario["rows"][0].id, msg: "Cadastrado" })
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: (error as Error).message })
        } finally {
            CloseConnection(conn)
        }
    }
)

router.post(
    "/associarInteGos",
    async (req, res) => {
        const conn = await OpenConnection()

        const usuario = req.body.usuario
        const gostos = req.body.gostos
        const interesses = req.body.interesses

        try {
            let gostosIds = []
            let intereIds = []

            if (gostos) {
                const listaGostos = "'" + gostos.join("','") + "'"
                const gostosQuery = await conn.query(`SELECT id FROM gosto WHERE nome IN (${listaGostos});`)
                gostosIds = gostosQuery["rows"].map(g => g.id)
            }
            if (interesses) {
                const listaInteresses = "'" + interesses.join("','") + "'"
                const interessesQuery = await conn.query(`SELECT id FROM interesse WHERE nome IN (${listaInteresses});`)
                intereIds = interessesQuery["rows"].map(g => g.id)
            }

            if (gostosIds.length > 0) {
                const query = `(${usuario},` + gostosIds.join(`),(${usuario},`) + `)`

                await conn.query(`INSERT INTO gostoUsuario(usuario_id, gostos_id) VALUES ${query};`)
            }

            if (intereIds.length > 0) {
                const query = `(${usuario},` + intereIds.join(`),(${usuario},`) + `)`

                await conn.query(`INSERT INTO interesseUsuario(usuario_id, interesse_id) VALUES ${query};`)
            }

            res.status(200).json({ msg: "Associado" })
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: (error as Error).message })
        } finally {
            CloseConnection(conn)
        }
    }
)

router.post(
    "/editarInteGos",
    async (req, res) => {
        const conn = await OpenConnection()

        const usuario = req.body.usuario
        const gostosAntigos = req.body.gostosAntigos
        const gostos = req.body.gostos
        const interessesAntigos = req.body.interessesAntigos
        const interesses = req.body.interesses

        try {
            let gostosIds = []
            let intereIds = []

            if (gostos) {
                const listaGostos = "'" + gostos.join("','") + "'"
                const gostosQuery = await conn.query(`SELECT id FROM gosto WHERE nome IN (${listaGostos});`)
                gostosIds = gostosQuery["rows"].map(g => g.id)
            }
            if (interesses) {
                const listaInteresses = "'" + interesses.join("','") + "'"
                const interessesQuery = await conn.query(`SELECT id FROM interesse WHERE nome IN (${listaInteresses});`)
                intereIds = interessesQuery["rows"].map(g => g.id)
            }

            if (gostosIds.length > 0) {
                const query = `(${usuario},` + gostosIds.join(`),(${usuario},`) + `)`

                if (gostosAntigos != undefined && gostosAntigos.length > 0) {
                    const listaGosAntigo = (gostosAntigos as number[]).join(",")
                    await conn.query(`DELETE FROM gostoUsuario WHERE gostos_id in (${listaGosAntigo})`)
                }
                await conn.query(`INSERT INTO gostoUsuario(usuario_id, gostos_id) VALUES ${query};`)
            }

            if (intereIds.length > 0) {
                const query = `(${usuario},` + intereIds.join(`),(${usuario},`) + `)`

                if (interessesAntigos != undefined && interessesAntigos.length > 0) {
                    const listaInteAntigo = (interessesAntigos as number[]).join(",")
                    await conn.query(`DELETE FROM interesseUsuario WHERE interesse_id in (${listaInteAntigo})`)
                }
                await conn.query(`INSERT INTO interesseUsuario(usuario_id, interesse_id) VALUES ${query};`)
            }

            res.status(200).json({ msg: "Editado" })
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: (error as Error).message })
        } finally {
            CloseConnection(conn)
        }
    }
)

router.post(
    "/editar",
    async (req, res) => {
        const conn = await OpenConnection()

        let query = []
        let id = 0

        for (const [k, v] of Object.entries(req.body)) {
            if (k == "id") {
                id = v as number
            } else {
                query.push(`${k} = '${v}'`)
            }
        }

        const queryFormated = query.join(",")

        if (!queryFormated) {
            res.status(400).json({ msg: "Nenhum valor enviado para edição" })
        } else {
            try {
                await conn.query(`UPDATE usuario SET ${queryFormated} WHERE id = ${id}`)
                res.status(200).json({ msg: "Usuario editado" })
            } catch (error) {
                console.log(error);
                res.status(500).json({ msg: (error as Error).message })
            } finally {
                CloseConnection(conn)
            }
        }
    }
)

//
// GET
router.get(
    "/lista",
    async (req, res) => {
        const usuarioId = req.query.usuarioId;

        const conn = await OpenConnection();
        try {
            const queryUsuarios = await conn.query(`SELECT * FROM usuario where visualizar = true;`);
            const usuarios: any[] = queryUsuarios["rows"];

            if (usuarioId == undefined) {
                res.status(200).json({ usuarios: queryUsuarios["rows"] });
            }
            else {
                const interessesUsuario: any[] = await getInteresses(usuarioId as string);
                const gostosUsuario: any[] = await getGostos(usuarioId as string);
                for (let i = 0; i < usuarios.length; i++) {
                    const interesses: any[] = await getInteresses(usuarios[i].id);
                    const gostos: any[] = await getGostos(usuarios[i].id);

                    const interessesEmComum = interesses.map(i => i.id).filter(interesse => interessesUsuario.map(i => i.id).includes(interesse));
                    const gostosEmComum = gostos.map(g => g.id).filter(gosto => gostosUsuario.map(g => g.id).includes(gosto));

                    const pontos = interessesEmComum.length + gostosEmComum.length;
                    usuarios[i].pontos = pontos;
                }

                res.status(200).json({
                    usuarios: usuarios.sort((a: any, b: any) => b.pontos - a.pontos)
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: (error as Error).message });
        } finally {
            CloseConnection(conn);
        }
    }
)

router.get(
    "/login",
    async (req, res) => {
        const email = req.query.email
        const senha = req.query.senha as string

        const conn = await OpenConnection()
        try {
            const queRes = await conn.query(`SELECT id, senha FROM usuario WHERE email='${email}'`)
            const usuario = queRes["rows"]

            if (usuario.length > 0) {
                if (await compare(senha, usuario[0].senha)) {
                    res.status(200).json({ idUsuario: usuario[0].id, msg: "Usuário encontrado" })
                } else {
                    res.status(400).json({ msg: "Senha incorreta" })
                }
            } else {
                res.status(404).json({ msg: "Email incorreto" })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: (error as Error).message })
        } finally {
            CloseConnection(conn)
        }
    }
)

router.get(
    "/getUmUsuario",
    async (req, res) => {
        const id = req.query.id

        const conn = await OpenConnection()
        try {
            const queRes = await conn.query(`SELECT * FROM usuario WHERE id=${id}`)
            const usuario = queRes["rows"]

            if (usuario.length <= 0) {
                res.status(404).json({ msg: "Esse usuário não existe!" })
            } else if (usuario.length === 1) {
                res.status(200).json({ Usuario: usuario[0], msg: "Usuário encontrado" })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: (error as Error).message })
        } finally {
            CloseConnection(conn)
        }
    }
)

router.get(
    `/getInteressesUsuario`, async (req, res) => {
        const usuarioId = req.query.usuarioId

        const conn = await OpenConnection()
        try {
            const queRes = await conn.query(`select i.id, i.nome from interesseUsuario as iu inner join interesse as i on iu.interesse_id = i.id where usuario_id = ${usuarioId};`)
            const interesses = queRes["rows"]

            if (interesses.length <= 0) {
                res.status(404).json({ msg: "Esse usuário não tem interesses" })
            } else {
                res.status(200).json({ Interesses: interesses, msg: "Interesses encontrados" })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: (error as Error).message })
        } finally {
            CloseConnection(conn)
        }
    }
)

router.get(
    `/getGostosUsuario`, async (req, res) => {
        const usuarioId = req.query.usuarioId

        const conn = await OpenConnection()
        try {
            const queRes = await conn.query(`select g.id, g.nome from gostoUsuario as gu inner join gosto as g on gu.gostos_id = g.id where usuario_id = ${usuarioId};`)
            const gostos = queRes["rows"]

            if (gostos.length <= 0) {
                res.status(404).json({ msg: "Esse usuário não tem gostos" })
            } else {
                res.status(200).json({ Gostos: gostos, msg: "Gostos encontrados" })
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