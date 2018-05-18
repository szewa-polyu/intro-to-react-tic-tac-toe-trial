import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {  
  renderSquare(i) {    
    return ( 
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const numOfRows = 3;
    const numOfCols = 3;
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
            return (
              <span key={col}>
                {this.renderSquare(row * numOfCols + col)}
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
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastMovePos: -1,
        lastMoveTurn: null
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
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

  convertSquareIndexToRowAndColumn(idx) {
    return {
      row: Math.floor(idx / 3),
      col: idx % 3
    };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const lastMoveRowAndColumn = this.convertSquareIndexToRowAndColumn(step.lastMovePos);
      const desc = move ?
        'Go to move #' + move + ' (' + step.lastMoveTurn + ': ' + lastMoveRowAndColumn.row + ', ' + lastMoveRowAndColumn.col + ')' :
        'Go to game start (player: row, col)';
      const isMoveCurrentlySelected = this.state.stepNumber === move;
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} 
            className={isMoveCurrentlySelected ? 'selected-move' : ''}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    } 

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />

        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
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
      return squares[a];
    }
  }
  return null;
}
