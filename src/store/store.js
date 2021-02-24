import {applyMiddleware, combineReducers, createStore} from "redux";
import thunkMiddleware from "redux-thunk";

import gamesReducer from "./games-reduser";

const reducers = combineReducers({
    games: gamesReducer
})

const store = createStore(reducers, applyMiddleware(thunkMiddleware));

export default store;