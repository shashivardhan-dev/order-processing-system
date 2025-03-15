import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import logger from "../logger/index.js"



const auth = async function (req, res, next) {
    try {
        const bearerHeader = req.header('Authorization', 'Bearer Token')
        if (!bearerHeader) {
            return res.status(400).send({ status: false, message: ["Token is required"] })
        }
        const token = bearerHeader.split(' ')[1];
        let decodeToken = jwt.verify(token, config.accessTokenJwtSecret)
        req.userId = decodeToken.userId
        next()
    }
    catch (error) {

        if (error.message == "invalid token") return res.status(401).send({ status: false, message: ["authentication failed May be your header part is corrupted"] }) 
        if (error.message.startsWith("Unexpected")) return res.status(401).send({ status: false, message: ["authentication failed May be your payload part is corrupted"] }) 
        if (error.message == "invalid signature") return res.status(401).send({ status: false, message: ["authentication failed May be your signature part is corrupted"] }) 
        if (error.message == "jwt expired") return res.status(401).send({ status: false, message: ["authentication failed May be your Token is Expired"] }) 
       logger.error("Error while authenticating the user", error)
        return res.status(500).send({ status: false, message: ["Internal server error"] })

    }
}

export default { auth }