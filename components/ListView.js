//libs
import React from "react";
import moment from "moment";

import Router from 'next/router'
import Link from "next/link";

//components
import LoadingView from "./LoadingView";
import ErrorView from "./ErrorView";
import DatePicker from "./DatePicker";

//utils
import fetchGames from "./utils/fetchGames";

////
// Presentational
////

// this is a card component for displaying the winner
function teamLogoURL(teamCode) {
  return `https://securea.mlb.com/mlb/images/team_logos/124x150/${teamCode}.png`;
}

function GameCardTeam({ team }) {
    return <div className={`GameCardTeam ${team.winner ? 'Winner' : ''}`}>
        <span className="GameCardTeamName">{team.name}</span>
        <img className="GameCardTeamImage" src={teamLogoURL(team.code)} />
        <p className="GameCardTeamScore">{team.score}</p>
    </div>;
}

function GameCardTeamsVS() {
  return <span className="GameCardTeamsVS">vs</span>;
}

function GameCardStatus({ status }) {
  return <span className={`GameCardStatus ${status}`}>{status}</span>;
}

// this is a parent component of the team game card
function GameCard({ game }) {
  return (
    <Link href={`/game?id=${game.gameDataDirectory}`} prefetch>
        <div className="GameCard">
          <div className="GameCardTeams">
            <GameCardTeam team={game.home} />
            <GameCardTeamsVS />
            <GameCardTeam team={game.away} />
          </div>
          <GameCardStatus status={game.status} />
        </div>
    </Link>
  );
}

////
// Container
////

class ListView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingError: "",
      isLoading: true,
      games: [],
      date: moment()
    };
  }

  componentDidMount() {
    this.fetchGames(this.props.date);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchGames(nextProps.date);
  }

  fetchGames(date) {
    this.setState()

    // Supose date is formatted as YYYY/MM/DD
    const [ year, month, day ] = date.split('/', 3);
    console.log('- year:', year);
    console.log('- month:', month);
    console.log('- day:', day);
    // Fetch games for a given day
    fetchGames(year, month, day)
      // save into state
      .then(games => this.setState({ games: games, isLoading: false }))
      // Catch error
      .catch(err => this.setState({ errorLoading: String(err), isLoading: false }));
  }

  change = date => {
    this.setState({
      date: date
    });
    // Navigate to specific date
    Router.push(`/games?date=${date.format("YYYY/MM/DD")}`);
  };

  render() {
    // Handle errors in load
    if (this.state.errorLoading) {
      return <ErrorView msg={this.state.errorLoading} />;
    }

    // wait for the games to load
    if (this.state.isLoading) {
      return <LoadingView />;
    }
    return (
      <div className="ListView">
        <DatePicker onChange={this.change} date={this.state.date} />
        <div className="GameCards">
          {this.state.games.map(game => <GameCard game={game} />)}
        </div>
      </div>
    );
  }
}

export default ListView;
