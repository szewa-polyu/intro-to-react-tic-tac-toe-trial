import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {GameContext, GameContextProvider} from './game-context';

function Square(props) {
  const gameParams = props.gameParams;
  const squareValue = props.value;
  let btnClassName = "square";
  if (squareValue === gameParams.xSymbol) {
    btnClassName += " x-square";
  } else if (squareValue === gameParams.oSymbol) {
    btnClassName += " o-square";  
  }
  if (props.isOneOfWinnerThree) {
    btnClassName += " winner-square";
  }
  return (
    <button className={btnClassName} onClick={props.onClick}>
      {squareValue}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i, isOneOfWinnerThree) {    
    return (
      <GameContext.Consumer>
        {gameParams => (
          <Square
            gameParams={gameParams}
            value={this.props.squares[i]}
            isOneOfWinnerThree={isOneOfWinnerThree}
            onClick={() => this.props.onClick(i)}
          />
        )}        
      </GameContext.Consumer>
    );
  }

  render() {
    const gameParams = this.props.gameParams;
    const numOfRows = gameParams.numOfRows;
    const numOfCols = gameParams.numOfCols;
    let rowIndices = [];
    let colIndices = [];
    for (let i = 0; i < numOfRows; i++) {
      rowIndices.push(i);
    }
    for (let j = 0; j < numOfCols; j++) {
      colIndices.push(j);
    }

    const squares = rowIndices.map(row => {
      return (
        <div key={row} className="board-row">
          {colIndices.map(col => {
            const squareIdx = gameParams.convertRowAndColumnToSquareIndex(row, col, numOfCols);
            let isOneOfWinnerThree = false;
            if (this.props.winnerThree !== null) {
              isOneOfWinnerThree = this.props.winnerThree.includes(squareIdx);
            }
            return (
              <span key={col}>
                {this.renderSquare(squareIdx, isOneOfWinnerThree)}
              </span>
            );
          })}
        </div>
      );
    });

    return (
      <div>
        {squares}        
        {/* <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div> */}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    const gameParams = this.props.gameParams;
    this.state = {
      history: [{
        squares: Array(gameParams.numOfRows * gameParams.numOfCols).fill(null),
        lastMovePos: -1,
        lastMoveTurn: null
      }],
      stepNumber: 0,
      xIsNext: props.isXStartFirst,
      isSortMoveDescend: props.isDefaultSortMoveDescend,
    }
  }

  handleClick(i) {
    const gameParams = this.props.gameParams;
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (gameParams.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? gameParams.xSymbol : gameParams.oSymbol;
    this.setState({
      history: history.concat([{
        squares: squares,
        lastMovePos: i,
        lastMoveTurn: squares[i]
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  reverseMoves() {
    this.setState((prevState, props) => ({
      isSortMoveDescend: !prevState.isSortMoveDescend
    }));
  }

  render() {
    const gameParams = this.props.gameParams;
    const numOfRows = gameParams.numOfRows;
    const numOfCols = gameParams.numOfCols;

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerThree = gameParams.calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      const lastMoveRowAndColumn = gameParams.convertSquareIndexToRowAndColumn(step.lastMovePos, numOfCols);
      const desc = move ?
        'Go to move #' + move + ' (' + step.lastMoveTurn + ': ' + lastMoveRowAndColumn.row + ', ' + lastMoveRowAndColumn.col + ')' :
        'Go to game start (player: row, col)';
      const isMoveCurrentlySelected = this.state.stepNumber === move;
      const btnClassName = isMoveCurrentlySelected ? 'selected-move' : '';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} 
            className={btnClassName}>
            {desc}
          </button>
        </li>
      );
    });

    if (this.state.isSortMoveDescend) {
      moves = moves.reverse();
    }

    let status;
    if (winnerThree) {
      status = 'Winner: ' + current.squares[winnerThree[0]];
    } else if (moves.length === numOfRows * numOfCols + 1) {
      // draw game
      status = 'Draw game';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? gameParams.xSymbol : gameParams.oSymbol);
    } 

    return (
      <div className="game">
        <div className="game-board">
          <GameContext.Consumer>
            {gameParams => (
              <Board
                gameParams={gameParams}
                squares={current.squares}
                winnerThree={winnerThree}
                onClick={(i) => this.handleClick(i)}
              />
            )}          
          </GameContext.Consumer>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button onClick={() => this.reverseMoves()}>
              Reverse moves
            </button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

class App extends React.Component {
  render() {
    return (
      <GameContextProvider>
        <GameContext.Consumer>
          {value => (
            <Game gameParams={value} />
          )}          
        </GameContext.Consumer>
      </GameContextProvider>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);