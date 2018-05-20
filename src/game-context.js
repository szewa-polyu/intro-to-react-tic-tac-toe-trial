// https://reactjs.org/docs/context.html#reactcreatecontext

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
    // The defaultValue argument is ONLY used 
    // by a Consumer when it does NOT have 
    // a matching Provider above it in the tree.
    defaultGameParams
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
        // the prop here MUST be called value,
        // it is to be passed to Consumers
        // that are descendants of this Provider
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
