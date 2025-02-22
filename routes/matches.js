const matches = require("../data/matches");
const { isAuthorized } = require("../middlewares/auth");

const router = require("express").Router();

router.get("/createMatch", matches.getCreateMatch);
router.get("/scheduleMatch", matches.getScheduleMatch);
router.post("/", matches.createMatch);
router.get("/history", matches.getMatches);
router.get("/:id/highlights", matches.getHighlights);
router.post("/:id/highlights", matches.postHighlights);
router.post("/scorecared", matches.postscorecard);
router.get("/:id/stats", matches.getStats);
router.post("/:id/stats", matches.postStats);

// router.post("/highlights", matches.postHighlights);
// router.route("/highlights").post(async (req, res) => {
//   let matchID = req.body.matchID;
//   let highlight = req.body.highlight;
//   matches.postHighlights2(matchID, highlight);
//   res.redirect("/matches/history");
// });

router.get("/viewMatch", matches.viewMatch);
router.get("/:id/players", matches.getPlayers);
router.post("/viewMatchWithId/:id", matches.postviewMatch);
router.get("/getMatch/:id", isAuthorized, matches.getviewMatch);

// router.put("/", matches.updateMatch);
// router.post("/comments", matches.postComment);
// router.post("/highlights", matches.postHighlights);

module.exports = router;
