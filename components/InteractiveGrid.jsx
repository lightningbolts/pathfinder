"use client"
import React, { useState } from 'react';

function InteractiveGrid() {
  const size = 50;
  const initialGrid = Array(size).fill().map(() => Array(size).fill(false));

  const [grid, setGrid] = useState(initialGrid);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = (rowIndex, colIndex) => {
    setIsMouseDown(true);
    handleClick(rowIndex, colIndex);
  };

  const handleMouseOver = (rowIndex, colIndex) => {
    if (isMouseDown) {
      handleClick(rowIndex, colIndex);
    }
  };

  const handleClick = (rowIndex, colIndex) => {
    setGrid(prevGrid => {
      return prevGrid.map((row, r) =>
        row.map((col, c) =>
          r === rowIndex && c === colIndex ? !col : col
        )
      );
    });
  };

  return (
    <div
      className="grid"
      onMouseLeave={() => setIsMouseDown(false)}
    >
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((col, colIndex) => (
            <div
              key={colIndex}
              className={`tile ${col ? 'black' : 'white'}`}
              onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
              onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
              onMouseUp={() => setIsMouseDown(false)}
              onDragStart={(event) => event.preventDefault()}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default InteractiveGrid;