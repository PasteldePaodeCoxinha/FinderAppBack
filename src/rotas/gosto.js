const express = require("express");
const router = express.Router();
const {OpenConnection, CloseConnection} = require("../config/database")


router.get(
    "/lista",
    async(req, res) => {
        const conn = await OpenConnection()
        try {
            const query = await conn.query(`SELECT * FROM gosto;`)
            res.status(200).json({gostos: query["rows"]})
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: error })
        } finally {
            CloseConnection(conn)
        }
    }
)

module.exports = router