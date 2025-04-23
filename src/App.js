import React, { useState, useEffect } from 'react';
import './App.css';

function Square({ value, onClick, winningSquare }) {
  return (
    <button 
      className={`square ${winningSquare ? 'winning' : ''}`} 
      onClick={onClick}
      value={value}
      disabled={value !== null}
    >
      {value}
    </button>
  );
}

function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [winningLine, setWinningLine] = useState(null);
  const [moveCount, setMoveCount] = useState(0);

  const calculateWinner = (squares) => {
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
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  const handleClick = (i) => {
    // Check if game hasn't started or square is already filled
    if (!gameStarted || squares[i] !== null) {
      return;
    }

    // Check if there's already a winner
    const result = calculateWinner(squares);
    if (result) {
      return;
    }

    // Create a new array with the current state
    const newSquares = squares.slice();
    
    // Place X or O based on whose turn it is
    newSquares[i] = xIsNext ? 'X' : 'O';
    
    // Update state
    setSquares(newSquares);
    setXIsNext(!xIsNext);
    setMoveCount(moveCount + 1);

    // Check for winner after move
    const newResult = calculateWinner(newSquares);
    if (newResult) {
      setWinningLine(newResult.line);
    }
  };

  const result = calculateWinner(squares);
  const winner = result?.winner;
  
  const status = !gameStarted 
    ? 'Click Play to start the game'
    : winner
    ? <span className="winner">Winner: {winner}</span>
    : moveCount === 9
    ? "It's a draw!"
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  const startGame = () => {
    setGameStarted(true);
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinningLine(null);
    setMoveCount(0);
  };

  const resetGame = () => {
    setGameStarted(false);
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinningLine(null);
    setMoveCount(0);
  };

  const renderSquare = (i) => {
    return (
      <Square 
        value={squares[i]} 
        onClick={() => handleClick(i)}
        winningSquare={winningLine?.includes(i)}
      />
    );
  };

  useEffect(() => {
    if (winner || moveCount === 9) {
      const timer = setTimeout(() => {
        // Add delay before allowing reset
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [winner, moveCount]);

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>
      <div className="status">{status}</div>
      <div className="board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
      <div className="game-controls">
        {!gameStarted ? (
          <button className="control-button" onClick={startGame}>
            Play
          </button>
        ) : (
          <button className="control-button secondary" onClick={resetGame}>
            Reset Game
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
