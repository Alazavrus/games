let initialState = {
    threeInRow: {
        countTypeTiles: 5,
        sizeTiles: 50,
        countHorizontalTiles: 12,
        countVerticalTiles: 12
    }
}

const gamesReducer = (state = initialState, action) => {
    switch(action.type) {
        default:
            return state
    }
}

export default gamesReducer