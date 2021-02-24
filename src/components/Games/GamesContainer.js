import ThreeInRow from "./ThreeInRow/ThreeInRow";
import {connect} from "react-redux";

const GamesContainer = (props) => {
    return <ThreeInRow {...props.games.threeInRow}/>
}

const mapStateToProps = (state) => ({
    games: state.games
})

export default connect(mapStateToProps, null)(GamesContainer);