"use client"
import React, {useEffect, useState} from 'react';
import FastPriorityQueue from "fastpriorityqueue";
const Colors = {
  WHITE: 'white',
  BLACK: 'black',
  RED: 'red',
  GREEN: 'green',
  LIGHT_BLUE: 'light_blue',
  YELLOW: 'yellow',
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

  const displayLightBlueNode = (node) => {
    if (!node) {
      console.error('Undefined node passed to displayLightBlueNode function');
      return;
    }
    setGrid(prevGrid => {
      // Create a copy of the current grid
      const newGrid = JSON.parse(JSON.stringify(prevGrid));
      // Update the color of the specific node in the copied grid
      if (newGrid[node.row][node.col].color !== Colors.RED && newGrid[node.row][node.col].color !== Colors.GREEN && newGrid[node.row][node.col].color !== Colors.BLACK) {
        newGrid[node.row][node.col] = makeNode(node.row, node.col, Colors.LIGHT_BLUE);
      }
      // Return the copied grid
      return newGrid;
    });
  }

  const displayYellowNode = (node) => {
    if (!node) {
      console.error('Undefined node passed to displayLightBlueNode function');
      return;
    }
    setGrid(prevGrid => {
      // Create a copy of the current grid
      const newGrid = JSON.parse(JSON.stringify(prevGrid));
      // Update the color of the specific node in the copied grid
      if (newGrid[node.row][node.col].color !== Colors.RED && newGrid[node.row][node.col].color !== Colors.GREEN && newGrid[node.row][node.col].color !== Colors.BLACK) {
        newGrid[node.row][node.col] = makeNode(node.row, node.col, Colors.YELLOW);
      }
      // Return the copied grid
      return newGrid;
    });
  };

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
  const [isRunning, setIsRunning] = useState(false);
  const [mazeSolver, setMazeSolver] = useState('');
  const [mazeGenerator, setMazeGenerator] = useState('');

  function render() {
    // console.log('Rendering grid');
    const grid = document.querySelector('.grid');
    const rows = grid.children;
    for (let i = 0; i < rows.length; i++) {
      const tiles = rows[i].children;
      for (let j = 0; j < tiles.length; j++) {
        const tile = tiles[j];
        const color = tile.className.split(' ')[1];
        if (color === Colors.BLACK) {
          tile.style.backgroundColor = 'black';
        } else if (color === Colors.WHITE) {
          tile.style.backgroundColor = 'white';
        } else if (color === Colors.RED) {
          tile.style.backgroundColor = 'red';
        } else if (color === Colors.GREEN) {
          tile.style.backgroundColor = 'green';
        } else if (color === Colors.LIGHT_BLUE) {
          tile.style.backgroundColor = 'lightblue';
        }
      }
    }
  }

  useEffect(() => {
    // Call the render method whenever the grid state changes
    render();
  }, [grid]);
  const getNeighbors = (grid, node) => {
    let neighbors = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // top, bottom, left, right
    for (const [dx, dy] of directions) {
      const newRow = getRow(node) + dx;
      const newCol = getCol(node) + dy;
      if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length && getTileColor(grid[newRow][newCol]) !== Colors.BLACK){
        neighbors.push(grid[newRow][newCol]); // Use the actual node from the grid
      }
    }
    return neighbors;
  }

  const reconstructPath = (cameFrom, current) => {
    let path = [];
    for (let at = current; at != null; at = cameFrom[at.row][at.col]) {
      path.push(at);
    }
    path.reverse();
    return path;
  }

  const heuristic = (a, b) => {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  }

  const aStarSearch = (grid, start) => {
    const visited = Array(grid.length).fill().map(() => Array(grid[0].length).fill(false));
    const cameFrom = Array(grid.length).fill().map(() => Array(grid[0].length).fill(null));
    const gScore = Array(grid.length).fill().map(() => Array(grid[0].length).fill(Infinity));
    const fScore = Array(grid.length).fill().map(() => Array(grid[0].length).fill(Infinity));
    gScore[start.row][start.col] = 0;
    fScore[start.row][start.col] = heuristic(start, grid[size-3][size-3]);
    const priorityQueue = new FastPriorityQueue((a, b) => fScore[a.row][a.col] < fScore[b.row][b.col]);
    priorityQueue.add(start);
    while (!priorityQueue.isEmpty()) {
      let currentNode = priorityQueue.poll();
      if (grid[currentNode.row][currentNode.col].color === Colors.GREEN) {
        console.log('Found the end tile');
        let path = reconstructPath(cameFrom, currentNode);
        // Wait until the path is reconstructed before displaying the yellow nodes
        setTimeout(() => {
          for (const node of path) {
            displayYellowNode(node);
          }
        }, 5);
        return;
      }
      for (const neighbor of getNeighbors(grid, currentNode)) {
        let tentativeGScore = gScore[currentNode.row][currentNode.col];
        if (tentativeGScore < gScore[neighbor.row][neighbor.col]) {
          cameFrom[neighbor.row][neighbor.col] = currentNode;
          gScore[neighbor.row][neighbor.col] = tentativeGScore;
          fScore[neighbor.row][neighbor.col] = gScore[neighbor.row][neighbor.col] + heuristic(neighbor, grid[size-3][size-3]);
          if (!visited[neighbor.row][neighbor.col]) {
            priorityQueue.add(neighbor);
            visited[neighbor.row][neighbor.col] = true;
            // Wait 50ms before displaying the next light blue node
            setTimeout(() => {
              displayLightBlueNode(neighbor);
            }, 5);
          }
        }
      }
    }
  }
  const breadthFirstSearch = (grid, start) => {
    let queue = [start];
    let visited = Array(grid.length).fill().map(() => Array(grid[0].length).fill(false));
    let prev = Array(grid.length).fill().map(() => Array(grid[0].length).fill(null));
    visited[start.row][start.col] = true;
    while (queue.length > 0) {
      let currentNode = queue.shift();
      if (grid[currentNode.row][currentNode.col].color === Colors.GREEN) {
        console.log('Found the end tile');
        let path = reconstructPath(prev, currentNode);
        // Wait until the path is reconstructed before displaying the yellow nodes
        setTimeout(() => {
          for (const node of path) {
            displayYellowNode(node);
          }
        }, 5);
        return;
      }
      for (const neighbor of getNeighbors(grid, currentNode)) {
        if (!visited[neighbor.row][neighbor.col] && grid[neighbor.row][neighbor.col].color !== Colors.BLACK) {
          queue.push(neighbor);
          visited[neighbor.row][neighbor.col] = true;
          prev[neighbor.row][neighbor.col] = currentNode;
            // Wait 50ms before displaying the next light blue node
            setTimeout(() => {
              displayLightBlueNode(neighbor);
            }, 5);
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

  const checkIfThereIsALightBlueNodeInGrid = (grid) => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j].color === Colors.LIGHT_BLUE) {
          return true;
        }
      }
    }
    return false;
  }

  const handleClick = (rowIndex, colIndex) => {
    if (grid[rowIndex][colIndex].color === Colors.RED || grid[rowIndex][colIndex].color === Colors.GREEN) {
      // Do not allow toggling the start and end tiles
      return;
    }
    if (!isRunning && (checkIfThereIsALightBlueNodeInGrid(grid))) {
      // Set all the light blue and yellow nodes to white
        setGrid(prevGrid => {
            return prevGrid.map((row, r) =>
                row.map((node, c) =>
                    node.color === Colors.LIGHT_BLUE || node.color === Colors.YELLOW ? makeNode(r, c, Colors.WHITE) : node
                )
            );
        });
    } else if (!isRunning) {
      // If the algorithm is not running and the clicked tile is not light blue or yellow, toggle between white and black
      setGrid(prevGrid => {
        return prevGrid.map((row, r) =>
            row.map((node, c) =>
                r === rowIndex && c === colIndex ? makeNode(r, c, node.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE) : node
            )
        );
      });
    }
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
      <div className="container">
        <div className="column-20">
          <h1>Pathfinder</h1>
          <select id="maze-solver" onChange={(event) => {
              switch(event.target.value) {
                  case 'dijkstra':
                      setMazeSolver('dijkstra');
                      break;
                  case 'a-star':
                      setMazeSolver('a-star');
                      break;
                  case 'greedy-best-first':
                      setMazeSolver('greedy-best-first');
                      break;
                  case 'breadth-first':
                      setMazeSolver('breadth-first');
                      break;
                  case 'depth-first':
                      setMazeSolver('depth-first');
                      break;
                  default:
                      break;
              }
          }}>
              <option value="">Select a maze solver</option>
              <option value="dijkstra">Dijkstra's Algorithm</option>
              <option value="a-star">A* Search</option>
              <option value="greedy-best-first">Greedy Best-First Search</option>
              <option value="breadth-first">Breadth-First Search</option>
              <option value="depth-first">Depth-First Search</option>
          </select>
          <select id="maze-generator" onChange={
            (event) => {
              switch(event.target.value) {
                case 'recursive-division':
                  setMazeGenerator('recursive-division');
                  break;
                case 'random-walk':
                  setMazeGenerator('random-walk');
                  break;
                case 'prim':
                  setMazeGenerator('prim');
                  break;
                case 'kruskal':
                  setMazeGenerator('kruskal');
                  break;
                case 'eller':
                  setMazeGenerator('eller');
                  break;
                default:
                  break;
              }
            }
          }>
            <option value="">Select a maze generator</option>
            <option value="recursive-division">Recursive Division</option>
            <option value="random-walk">Random Walk</option>
            <option value="prim">Prim's Algorithm</option>
            <option value="kruskal">Kruskal's Algorithm</option>
            <option value="eller">Eller's Algorithm</option>
          </select>
          <button id="clear-maze" onClick={
            () => {
              setGrid(initialGrid);
            }
          }>Clear Maze</button>
          <button id="run" onClick={
            () => {
                if (mazeSolver === 'breadth-first') {
                  setIsRunning(true);
                  breadthFirstSearch(grid, grid[2][2]);
                  setIsRunning(false);
                } else if (mazeSolver === 'a-star') {
                    setIsRunning(true);
                    aStarSearch(grid, grid[2][2]);
                    setIsRunning(false);
                }
            }
          }>Run</button>
        </div>
        <div className="column-80">
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
                          style={node.color === Colors.YELLOW ? {backgroundColor: 'yellow'} : {}}
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
        </div>
      </div>
  );
}

export default InteractiveGrid;