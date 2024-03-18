"use client"
import React, {useEffect, useState} from 'react';
const Colors = {
  WHITE: 'white',
  BLACK: 'black',
  RED: 'red',
  GREEN: 'green',
  LIGHT_BLUE: 'light_blue',
};
function InteractiveGrid() {
  const getRow = (node) => {
    if (!node) {
      console.error('Undefined node passed to getRow function');
      return null;
    }
    return node.row;
  }

  const getCol = (node) => {
    if (!node) {
      console.error('Undefined node passed to getCol function');
      return null;
    }
    return node.col;
  }

  const getTileColor = (node) => {
    if (!node) {
      console.error('Undefined node passed to getTileColor function');
      return null;
    }
    return node.color;
  }

  const makeNode = (row, col, color) => {
    return {
      row: row,
      col: col,
      color: color,
    }
  }

  const size = 50;
  // Render initial grid as a 2D array, with each node representing this data structure:
    // {
    //   row: 0,
    //   col: 0,
    //   color: 'white',
    // }
  const initialGrid = [];
  for (let i = 0; i < size; i++) {
    const currentRow = [];
    for (let j = 0; j < size; j++) {
      currentRow.push(makeNode(i, j, Colors.WHITE));
    }
    initialGrid.push(currentRow);
  }
  initialGrid[2][2] = makeNode(2, 2, Colors.RED) // start tile
  initialGrid[size-3][size-3] = makeNode(size-3, size-3, Colors.GREEN); // end tile

  const [grid, setGrid] = useState(initialGrid);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragging, setDragging] = useState(null);
  const getNeighbors = (grid, node) => {
    let neighbors = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // top, bottom, left, right
    for (const [dx, dy] of directions) {
      const newRow = getRow(node) + dx;
      const newCol = getCol(node) + dy;
      if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
        neighbors.push(makeNode(newRow, newCol, getTileColor(node)));
      }
    }
    // console.log(neighbors, "neighbors");
    return neighbors;
  }
  const breadthFirstSearch = (grid, start) => {
    // console.log('BFS')
    let queue = [start];
    let visited = Array(grid.length).fill().map(() => Array(grid[0].length).fill(false));
    visited[start.row][start.col] = true;
    while (queue.length > 0) {
      let currentNode = queue.shift();
      console.log(currentNode);
      if (grid[currentNode.row][currentNode.col].color === Colors.GREEN) {
        console.log('Found the end tile');
        console.log(currentNode);
        return;
      }
      for (const neighbor of getNeighbors(grid, currentNode)) {
        // console.log(neighbor, "neighbor");
        if (!visited[neighbor.row][neighbor.col] && grid[neighbor.row][neighbor.col].color !== Colors.BLACK) {
          queue.push(neighbor);
          visited[neighbor.row][neighbor.col] = true;
        }
      }
    }
  }
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
    if (grid[rowIndex][colIndex].color === Colors.RED || grid[rowIndex][colIndex].color === Colors.GREEN) {
      // Do not allow toggling the start and end tiles
      return;
    }
    setGrid(prevGrid => {
      return prevGrid.map((row, r) =>
          row.map((node, c) =>
              r === rowIndex && c === colIndex ? makeNode(r, c, node.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE) : node
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
        <div>
      <div
          className="grid"
          onMouseLeave={() => setIsMouseDown(false)}
      >
        {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((node, colIndex) => (
                  <div
                      key={colIndex}
                      className={`tile ${node.color}`}
                      draggable={node.color === Colors.RED || node.color === Colors.GREEN}
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
        <button id="run" onClick={() => {
            breadthFirstSearch(grid, grid[2][2]);
        }}>Run</button>
        <button id="clear-maze" onClick={() => {
            setGrid(initialGrid);
        }}>Clear Maze</button>
    </div>
  );
}

export default InteractiveGrid;