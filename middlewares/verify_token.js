const admin = require('firebase-admin');
const errorResponse = require("../utils/errors/errorResponse.js");

async function decodeIDToken(req, res, next) {

    console.log(req.headers);
    const header = req.headers?.authorization;
    if (header !== 'Bearer null' && req.headers?.authorization?.startsWith('Bearer ')) {
        const idToken = req.headers.authorization.split('Bearer ')[1];
        const userId = req.headers.userid;
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            req['authorization'] = decodedToken;
            req['userId'] = userId;
            next();
        } catch (error) {
            next(error);
        }
    }else{
        next(errorResponse.idNotFoundError());
    }
}
module.exports = decodeIDToken;
