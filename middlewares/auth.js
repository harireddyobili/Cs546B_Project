const ServerError = require('../shared/server-error');
const Matches = require('../models/matches');
const { isValidObjectId: isObjectId } = require("mongoose");

module.exports = {
    isAuthenticated,
    isAuthorized,
};

async function isAuthenticated(req, res, next) {
    const url = req.originalUrl;
    if (req.session.user) {
        if (['/', '/users/login', 'users/signup'].includes(url)) {
            return res.render('matches/home');
        } else {
            return next();
        }
    } else {
        if (['/users/login', '/users/signup'].includes(url)) return next();
        else return next(new ServerError(403, 'User not logged in'));
    }
}

async function isAuthorized(req, res, next) {
    try {
        if (req.session.user) {
            const id = req.params.id;

            if (!isObjectId(id)) throw new ServerError(400, 'Invalid match id');

            const match = await Matches.findOne({ _id: id }, { userId: 1 });

            if (!match) {
                throw new ServerError(400, 'Match does not exist with given Id');
            }

            if (req.session.user.id == match.userId) {
                req.session.user.currentMatch = true;
            }

            return next();
        } else {
            throw new ServerError(403, 'User not logged in');
        }
    } catch (error) {
        if (error.status == 403) throw error;
        return res.render("matches/error", { data: error.message });
    }
}