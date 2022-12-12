const Matches = require("../models/matches");
const validator = require("../validators/matches");
const ServerError = require("../shared/server-error");
const sendResponse = require("../shared/sendResponse");
const moment = require("moment");
const { ObjectId } = require("mongodb");

module.exports = {
  getCreateMatch,
  createMatch,
  getScheduleMatch,
  getMatches,
  getHighlights,
  postHighlights,
  postscorecard,
  viewMatch,
};

async function getCreateMatch(req, res, next) {
  try {
    return res.render("matches/create");
  } catch (error) {
    if (error instanceof ServerError) {
      return next(error);
    }
    return next(new ServerError(500, error.message));
  }
}

async function viewMatch(req, res, next) {
  try {
    return res.render("matches/viewMatch");
  } catch (error) {
    if (error instanceof ServerError) {
      return next(error);
    }
    return next(new ServerError(500, error.message));
  }
}

async function getMatches(req, res, next) {
  try {
    const matches = await Matches.find({ userId: req.session.user.id }).lean();
    return res.render("matches/history", { data: matches });
  } catch (error) {
    if (error instanceof ServerError) {
      return next(error);
    }
    return next(new ServerError(500, error.message));
  }
}
async function getScheduleMatch(req, res, next) {
  try {
    return res.render("matches/schedule");
  } catch (error) {
    if (error instanceof ServerError) {
      return next(error);
    }
    return next(new ServerError(500, error.message));
  }
}

async function createMatch(req, res, next) {
  try {
    const reqBody = req.body;

    const { error } = validator.validateCreate(reqBody);
    if (error) {
      throw new ServerError(400, error.message);
    }

    const startTime = reqBody.startTime || moment().unix();
    const endTime = startTime + reqBody.duration * 60;

    const team1 = reqBody.team1;
    const team2 = reqBody.team2;

    let match = {
      name: reqBody.name,
      userId: req.session.user.id,
      startTime: startTime,
      endTime: endTime,
      duration: reqBody.duration,
      team1: {
        name: team1.name,
        players: team1.players,
      },
      team2: {
        name: team2.name,
        players: team2.players,
      },
    };

    const result = await Matches.create(match);
    return sendResponse(res, 200, result);
  } catch (error) {
    if (error instanceof ServerError) {
      return next(error);
    }
    return next(new ServerError(500, error.message));
  }
}

async function getHighlights(req, res, next) {
  try {
    return res.render("matches/postmatch");
  } catch (error) {
    if (error instanceof ServerError) {
      return next(error);
    }
    return next(new ServerError(500, error.message));
  }
}
async function postHighlights(req, res, next) {
  try {
    //update highlights array of match
    const matchId = req.body.matchID;

    const match = await Matches.findOneAndUpdate(
      { _id: ObjectId(matchId) },
      { $push: { highlights: req.body.higlight } },
      { new: true }
    ).lean();

    return sendResponse(res, 200, match);
  } catch (error) {
    if (error instanceof ServerError) {
      return next(error);
    }
    return next(new ServerError(500, error.message));
  }
}
async function postscorecard(req, res, next) {
  try {
    const matchId = req.body.matchID;
    const team1stats = req.body.team1stats;
    const team2stats = req.body.team2stats;
    //find match id and replace team1 object with key stats with new stats
    const match1 = await Matches.findOneAndUpdate(
      { _id: ObjectId(matchId) },
      { $set: { team1: { stats: team1stats } } },
      { new: true }
    ).lean();
    //find match id and replace team2 object with key stats with new stats
    const match2 = await Matches.findOneAndUpdate(
      { _id: ObjectId(matchId) },

      { $set: { team2: { stats: team2stats } } },
      { new: true }
    ).lean();
    //get match with id and return
    const match = await Matches.findOne({ _id: ObjectId(matchId) }).lean();
    return sendResponse(res, 200, match);
  } catch (error) {
    if (error instanceof ServerError) {
      return next(error);
    }
    return next(new ServerError(500, error.message));
  }
}

// async function postHighlights2(matchID, highlight) {
//   const matchId = matchID;
//   const highLight = highlight;
//   //find match with id nd update highlights append new hightlight to array
//   const match = await Matches.findOneAndUpdate(
//     { _id: ObjectId(matchId) },
//     { $push: { highlights: highLight } },
//     { new: true }
//   ).lean();

//   return sendResponse(res, 200, match);
// }
