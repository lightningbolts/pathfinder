"use client"
import React, { useState } from 'react';
const Colors = {
  WHITE: 'white',
  BLACK: 'black',
  RED: 'red',
  GREEN: 'green',
  LIGHT_BLUE: 'light_blue',
};
function InteractiveGrid() {
  const size = 50;
  const initialGrid = Array(size).fill().map(() => Array(size).fill(Colors.WHITE));
  initialGrid[2][2] = Colors.RED; // start tile
  initialGrid[size-3][size-3] = Colors.GREEN; // end tile

  const [grid, setGrid] = useState(initialGrid);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragging, setDragging] = useState(null);

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
    if (grid[rowIndex][colIndex] === Colors.RED || grid[rowIndex][colIndex] === Colors.GREEN) {
      // Do not allow toggling the start and end tiles
      return;
    }
    setGrid(prevGrid => {
      return prevGrid.map((row, r) =>
          row.map((col, c) =>
              r === rowIndex && c === colIndex ? (col === Colors.WHITE ? Colors.BLACK : Colors.WHITE) : col
          )
      );
    });
  };
  const handleDragStart = (rowIndex, colIndex) => {
    setDragging({ rowIndex, colIndex });
  };

  const handleDrop = (rowIndex, colIndex) => {
    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      const temp = newGrid[dragging.rowIndex][dragging.colIndex];
      newGrid[dragging.rowIndex][dragging.colIndex] = newGrid[rowIndex][colIndex];
      newGrid[rowIndex][colIndex] = temp;
      return newGrid;
    });
    setDragging(null);
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
                  className={`tile ${col}`}
                  draggable={col === Colors.RED || col === Colors.GREEN}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
                  onMouseUp={() => setIsMouseDown(false)}
                  onDragStart={() => handleDragStart(rowIndex, colIndex)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(rowIndex, colIndex)}
              />
          ))}
        </div>
      ))}
    </div>
  );
}

export default InteractiveGrid;