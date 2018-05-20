import React from 'react';

const defaultGameParams = {
    xSymbol: 'X',
    oSymbol: 'O',
    numOfRows: 3,
    numOfCols: 3,
    isXStartFirst: false,
    isDefaultSortMoveDescend: true,
    calculateWinner: (squares) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return lines[i];
            }
        }
        return null;
    },
    convertSquareIndexToRowAndColumn: (idx, numOfCols) => {
        return {
          row: Math.floor(idx / numOfCols),
          col: idx % numOfCols
        };
    },
    convertRowAndColumnToSquareIndex: (row, col, numOfCols) => {
        return row * numOfCols + col;
    }
};

const GameContext = React.createContext(
    defaultGameParams  // default value
);

class GameContextProvider extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        gameParams: defaultGameParams
      };
    }
  
    render() {
      return (
        <GameContext.Provider value={this.state.gameParams}>
          {this.props.children}
        </GameContext.Provider>      
      );
    }
}

export {
    GameContext,
    GameContextProvider
}
