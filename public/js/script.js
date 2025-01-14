async function signUpUI(event) {
  try {
    event.preventDefault();
    const signUpFirstName = document.getElementById("signup-firstName").value;
    const signUpLastName = document.getElementById("signup-lastName").value;
    const signUpUsername = document.getElementById("signup-username").value;
    const signUpPassword = document.getElementById("signup-password").value;
    let data = {
      firstName: signUpFirstName,
      lastName: signUpLastName,
      username: signUpUsername,
      password: signUpPassword,
    };

    data = JSON.stringify(data);

    let response = await fetch("/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    response = await response.json();
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
}

async function createMatch(event) {
  try {
    event.preventDefault();
    const matchName = document.getElementById("match_name").value;
    if (!checkName(matchName)) {
      throw "Match name should not be empty and it has to be alphanumeric(can include spaces) with strictly more than 2 characters";
    }
    if (
      !checkName(document.getElementById("team1_name").value) ||
      !checkName(document.getElementById("team2_name").value)
    ) {
      throw "Team name should not be empty and it has to be alphanumeric(can include spaces) with strictly more than 2 characters";
    }
    if (
      !checkName(document.getElementById("team1_player1").value) ||
      !checkName(document.getElementById("team1_player2").value) ||
      !checkName(document.getElementById("team1_player3").value) ||
      !checkName(document.getElementById("team1_player4").value) ||
      !checkName(document.getElementById("team1_player5").value) ||
      !checkName(document.getElementById("team1_player6").value) ||
      !checkName(document.getElementById("team1_player7").value) ||
      !checkName(document.getElementById("team1_player8").value) ||
      !checkName(document.getElementById("team1_player9").value) ||
      !checkName(document.getElementById("team1_player10").value) ||
      !checkName(document.getElementById("team1_player11").value) ||
      !checkName(document.getElementById("team2_player1").value) ||
      !checkName(document.getElementById("team2_player2").value) ||
      !checkName(document.getElementById("team2_player3").value) ||
      !checkName(document.getElementById("team2_player4").value) ||
      !checkName(document.getElementById("team2_player5").value) ||
      !checkName(document.getElementById("team2_player6").value) ||
      !checkName(document.getElementById("team2_player7").value) ||
      !checkName(document.getElementById("team2_player8").value) ||
      !checkName(document.getElementById("team2_player9").value) ||
      !checkName(document.getElementById("team2_player10").value) ||
      !checkName(document.getElementById("team2_player11").value)
    ) {
      throw "Player/s name should not be empty and it has to be alphanumeric(can include spaces) with strictly more than 2 characters";
    }
    const team1 = {
      name: document.getElementById("team1_name").value,
      players: [
        document.getElementById("team1_player1").value,
        document.getElementById("team1_player2").value,
        document.getElementById("team1_player3").value,
        document.getElementById("team1_player4").value,
        document.getElementById("team1_player5").value,
        document.getElementById("team1_player6").value,
        document.getElementById("team1_player7").value,
        document.getElementById("team1_player8").value,
        document.getElementById("team1_player9").value,
        document.getElementById("team1_player10").value,
        document.getElementById("team1_player11").value,
      ],
    };

    const team2 = {
      name: document.getElementById("team2_name").value,
      players: [
        document.getElementById("team2_player1").value,
        document.getElementById("team2_player2").value,
        document.getElementById("team2_player3").value,
        document.getElementById("team2_player4").value,
        document.getElementById("team2_player5").value,
        document.getElementById("team2_player6").value,
        document.getElementById("team2_player7").value,
        document.getElementById("team2_player8").value,
        document.getElementById("team2_player9").value,
        document.getElementById("team2_player10").value,
        document.getElementById("team2_player11").value,
      ],
    };
    const duration = document.getElementById("duration").value;

    let data = {
      name: matchName,
      duration: duration,
      team1: team1,
      team2: team2,
    };

    data = JSON.stringify(data);

    let response = await fetch("/matches/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    response = await response.json();
    window.location.href = "/matches/history";
  } catch (error) {
    console.log(error);
  }
}

async function viewmatch(event) {
  try {
    event.preventDefault();
    const matchid = document.getElementById("match_id").value;

    window.location.href = `/matches/getMatch/${matchid}`;
  } catch (error) {
    console.log(JSON.stringify(error));
    alert(error.data.message);
  }
}

async function editHighlights(event) {
  try {
    event.preventDefault();
    const id = document.getElementById("matchId").value;
    console.log(id);
    const highlight = document.getElementById("commentary-form-input").value;
    // let id = url.split("/")[4];
    let data = {
      id: id,
      highlight: highlight,
    };

    data = JSON.stringify(data);

    let response = await fetch(`/matches/${id}/highlights`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    response = await response.json();
    window.location.href = response.url;
  } catch (error) {
    console.log(error);
  }
}
function checkNum(num) {
  num = num.trim();
  if (typeof Number(num) === number && Number(num) != NaN) return false;
  else return true;
}

function checkName(str) {
  str = str.trim();
  let n = str.length;
  if (n < 3) return false;
  const nameRegex = new RegExp("^[a-zA-Z0-9_]*$");
  return nameRegex.test(str);
}

function checkCom(str) {
  str = str.trim();
  if (str.length < 5) return true;
  else return false;
}

async function editstats(event) {
  try {
    event.preventDefault();
    const matchid = document.getElementById("matchId").value;
    const team1 = {
      goals: document.getElementById("edit_team1_goals").value,
      fouls: document.getElementById("edit_team1_fouls").value,
      yellowCards: document.getElementById("edit_team1_yellowcards").value,
      redCards: document.getElementById("edit_team1_redcards").value,
      shots: document.getElementById("edit_team1_shots").value,
      shotsOnTarget: document.getElementById("edit_team1_shotsontarget").value,
      corners: document.getElementById("edit_team1_corners").value,
      offsides: document.getElementById("edit_team1_offsides").value,
    };

    const team2 = {
      goals: document.getElementById("edit_team2_goals").value,
      fouls: document.getElementById("edit_team2_fouls").value,
      yellowCards: document.getElementById("edit_team2_yellowcards").value,
      redCards: document.getElementById("edit_team2_redcards").value,
      shots: document.getElementById("edit_team2_shots").value,
      shotsOnTarget: document.getElementById("edit_team2_shotsontarget").value,
      corners: document.getElementById("edit_team2_corners").value,
      offsides: document.getElementById("edit_team2_offsides").value,
    };

    let data = {
      team1: team1,
      team2: team2,
    };

    data = JSON.stringify(data);

    let response = await fetch(`/matches/${matchid}/stats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    response = await response.json();

    window.location.href = `/matches/getMatch/${matchid}`;
  } catch (error) {
    console.log(JSON.stringify(error));
    alert(error.data.message);
  }
}
