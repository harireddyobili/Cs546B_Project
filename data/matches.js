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
  postviewMatch,
  getviewMatch,
  getPlayers,
  getStats,
  postStats,
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

async function getPlayers(req, res, next) {
  try {
    const reqBody = req.body;
    const match_id = req.params.id;
    const match = await Matches.findOne({ _id: ObjectId(match_id) }).lean();
    const players = [];
    for (let i = 0; i < 11; i++) {
      players.push({
        team1: match.team1.players[i],
        team2: match.team2.players[i],
      });
    }
    if (match) {
      return res.render("matches/players", {
        id: match_id,
        team1Name: match.team1.name,
        team2Name: match.team2.name,
        players: players,
      });
    }
  } catch (error) {
    if (error instanceof ServerError) {
      return next(error);
    }
    return next(new ServerError(500, error.message));
  }
}

async function postviewMatch(req, res, next) {
  try {
    const reqBody = req.body;
    const match_id = req.params.id;
    // const match = await Matches.findOne({ _id: ObjectId(match_id) }).lean();
    //render edit scoreboard page
    return res.send({ url: `/matches/viewMatchWithId/${match_id}` });
  } catch (error) {
    if (error instanceof ServerError) {
      return next(error);
    }
    return next(new ServerError(500, error.message));
  }
}

async function getviewMatch(req, res, next) {
  try {
    const reqBody = req.body;
    const match_id = req.params.id;
    const match = await Matches.findOne({ _id: ObjectId(match_id) }).lean();
    if (match) {
      return res.render("matches/editScoreboard/editScoreboard", {
        id: match_id,
      });
    }
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
    return res.render("matches/editScoreboard/editHighlights", {
      id: req.params.id,
    });
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

    const matchId = req.params.id;
    const highlight = req.body.highlight;

    const match = await Matches.updateOne(
      { _id: ObjectId(matchId) },
      { $push: { highlights: highlight } }
    );

    return res.send({ url: `/matches/getMatch/${matchId}` });
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
async function getStats(req, res, next) {
  try {
    return res.render("matches/editScoreboard/editStats", {
      id: req.params.id,
    });
  } catch (error) {
    if (error instanceof ServerError) {
      return next(error);
    }
    return next(new ServerError(500, error.message));
  }
}
async function postStats(req, res, next) {
  try {
    const matchId = req.params.id;
    // const team2 = {
    //   goals: document.getElementById("team2_goals").value,
    //   fouls: document.getElementById("team2_fouls").value,
    //   yellowCards: document.getElementById("team2_yellowCards").value,
    //   redCards: document.getElementById("team2_redCards").value,
    //   shots: document.getElementById("team2_shots").value,
    //   shotsOnTarget: document.getElementById("team2_shotsOnTarget").value,
    //   corners: document.getElementById("team2_corners").value,
    //   offsides: document.getElementById("team2_offsides").value,
    // };
    const team1 = req.body.team1;
    const team2 = req.body.team2;

    //search match id and get current stats
    const match = await Matches.findOne({ _id: ObjectId(matchId) }).lean();
    //get current stats
    const team1stats = match.team1.stats;
    const team2stats = match.team2.stats;

    //add new stats to current stats
    const team1newStats = {
      goals: team1stats.goals + team1.goals,
      fouls: team1stats.fouls + team1.fouls,
      yellowCards: team1stats.yellowCards + team1.yellowCards,
      redCards: team1stats.redCards + team1.redCards,
      shots: team1stats.shots + team1.shots,
      shotsOnTarget: team1stats.shotsOnTarget + team1.shotsOnTarget,
      corners: team1stats.corners + team1.corners,
      offsides: team1stats.offsides + team1.offsides,
    };
    const team2newStats = {
      goals: team2stats.goals + team2.goals,
      fouls: team2stats.fouls + team2.fouls,
      yellowCards: team2stats.yellowCards + team2.yellowCards,
      redCards: team2stats.redCards + team2.redCards,
      shots: team2stats.shots + team2.shots,
      shotsOnTarget: team2stats.shotsOnTarget + team2.shotsOnTarget,
      corners: team2stats.corners + team2.corners,
      offsides: team2stats.offsides + team2.offsides,
    };
    //find match id and replace team1 object with key stats with new stats
    const match1 = await Matches.findOneAndUpdate(
      { _id: ObjectId(matchId) },
      { $set: { team1: { stats: team1newStats } } },
      { new: true }
    ).lean();

    //find match id and replace team2 object with key stats with new stats
    const match2 = await Matches.findOneAndUpdate(
      { _id: ObjectId(matchId) },

      { $set: { team2: { stats: team2newStats } } },
      { new: true }
    ).lean();

    //get match with id and return
    const match3 = await Matches.findOne({ _id: ObjectId(matchId) }).lean();
    return res.send({ url: `/matches/getMatch/${matchId}` });
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
