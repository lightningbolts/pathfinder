"use client"
import React, {useEffect, useState} from 'react';
import FastPriorityQueue from "fastpriorityqueue";

/**
 * Colors that can be used to color the nodes in the grid
 * The colors are used to represent the following:
 * @type {Object}
 * @property {string} WHITE - Empty node
 * @property {string} BLACK - Wall node
 * @property {string} RED - Start node
 * @property {string} GREEN - End node
 * @property {string} LIGHT_BLUE - Visited node
 * @property {string} YELLOW - Path node
 * */

const Colors = {
  WHITE: 'white',
  BLACK: 'black',
  RED: 'red',
  GREEN: 'green',
  LIGHT_BLUE: 'light_blue',
  YELLOW: 'yellow',
};

/**
 * InteractiveGrid component that displays a grid of nodes that can be interacted with.
 * The grid can be used to visualize pathfinding algorithms such as Dijkstra's Algorithm, A* Search, Greedy Best-First Search, Breadth-First Search, and Depth-First Search.
 * @returns {JSX.Element} The InteractiveGrid component
 * */
function InteractiveGrid() {

  /**
   * Helper function to get the row of a node.
   * The row is used to identify the position of the node in the grid.
   * @param {Object} node - The node to get the row from
   * @returns {number|null}
   */
  const getRow = (node) => {
    if (!node) {
      console.error('Undefined node passed to getRow function');
      return null;
    }
    return node.row;
  }

  /**
   * Helper function to get the column of a node.
   * The column is used to identify the position of the node in the grid.
   * @param {Object} node - The node to get the column from
   * @returns {number|null}
   */
  const getCol = (node) => {
    if (!node) {
      console.error('Undefined node passed to getCol function');
      return null;
    }
    return node.col;
  }

  /**
   * Helper function to get the color of a node.
   * The color is used to identify the state of the node in the grid.
   * @param {Object} node - The node to get the color from
   * @returns {string|null}
   */
  const getTileColor = (node) => {
    if (!node) {
      console.error('Undefined node passed to getTileColor function');
      return null;
    }
    return node.color;
  }

  /**
   * Helper function to create a node with a specific row, column, and color.
   * The node is used to represent a tile in the grid.
   * The node has the following properties:
   * @param {number} row - The row of the node
   * @param {number} col - The column of the node
   * @param {string} color - The color of the node
   * @returns {{col, color, row}}
   */
  const makeNode = (row, col, color) => {
    return {
      row: row,
      col: col,
      color: color,
    }
  }

  /**
   * Helper function to display a light blue node in the grid.
   * The light blue node is used to represent a visited node in the grid.
   * @param {Object} node - The node to display as light blue
   * @returns {void}
   */
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

  /**
   * Helper function to display a yellow node in the grid.
   * The yellow node is used to represent a path node in the grid.
   * @param {Object} node - The node to display as yellow
   * @returns {void}
   */

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

  /**
   * Helper function to display a black node in the grid.
   * The black node is used to represent a wall node in the grid.
   * @param {Object} node - The node to display as black
   * @returns {void}
   */

  const displayBlackNode = (node) => {
    if (!node) {
      console.error('Undefined node passed to displayBlackNode function');
      return;
    }
    setGrid(prevGrid => {
      // Create a copy of the current grid
      const newGrid = JSON.parse(JSON.stringify(prevGrid));
      // Update the color of the specific node in the copied grid
      if (newGrid[node.row][node.col].color !== Colors.RED && newGrid[node.row][node.col].color !== Colors.GREEN) {
        newGrid[node.row][node.col] = makeNode(node.row, node.col, Colors.BLACK);
      }
      // Return the copied grid
      return newGrid;
    });
  }

  /**
   * Helper function to display a white node in the grid.
   * The white node is used to represent an empty node in the grid.
   * @param {Object} node - The node to display as white
   * @returns {void}
   */

  const displayWhiteNode = (node) => {
    if (!node) {
      console.error('Undefined node passed to displayWhiteNode function');
      return;
    }
    setGrid(prevGrid => {
      // Create a copy of the current grid
      const newGrid = JSON.parse(JSON.stringify(prevGrid));
      // Update the color of the specific node in the copied grid
      if (newGrid[node.row][node.col].color !== Colors.RED && newGrid[node.row][node.col].color !== Colors.GREEN) {
        newGrid[node.row][node.col] = makeNode(node.row, node.col, Colors.WHITE);
      }
      // Return the copied grid
      return newGrid;
    });
  }

  // Initialize the grid with a size of 50x50

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

  // Set the start and end tiles
  initialGrid[2][2] = makeNode(2, 2, Colors.RED) // start tile
  initialGrid[size-3][size-3] = makeNode(size-3, size-3, Colors.GREEN); // end tile

  // Initialize the grid state with the initial grid

  const [grid, setGrid] = useState(initialGrid);

  // Initialize the state variables

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [mazeSolver, setMazeSolver] = useState('');
  const [mazeGenerator, setMazeGenerator] = useState('');
  const [start, setStart] = useState(initialGrid[2][2]);
  const [end, setEnd] = useState(initialGrid[size-3][size-3]);

  // Set the start and end tiles whenever the grid state changes

  useEffect(() => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j].color === Colors.RED) {
          setStart(grid[i][j])
        } else if (grid[i][j].color === Colors.GREEN) {
          setEnd(grid[i][j]);
        }
      }
    }
  }, [grid]);

  /**
   * Helper function to render the grid.
   * The grid is rendered by changing the background color of the tiles based on their color.
   * @returns {void}
   */
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

  /**
   * Helper function to get the neighbors of a node.
   * The neighbors are the nodes that are adjacent to the current node.
   * The neighbors are used to explore the grid in the pathfinding algorithm.
   * The neighbors are returned as an array of nodes.
   * The neighbors are filtered based on the following conditions:
   * - The neighbor is within the bounds of the grid
   * - The neighbor is not a wall node
   * @param {Array} grid - The grid to get the neighbors from
   * @param {Object} node - The node to get the neighbors from
   * @returns {Array}
   * */

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

  /**
   * Helper function to reconstruct the path from the start node to the end node.
   * The path is reconstructed by following the cameFrom map.
   * The path is returned as an array of nodes.
   * The path is used to display the shortest path between the start and end nodes.
   * @param cameFrom
   * @param current
   * @returns {*[]}
   */
  const reconstructPath = (cameFrom, current) => {
    let path = [];
    for (let at = current; at != null; at = cameFrom[at.row] && cameFrom[at.row][at.col] ? cameFrom[at.row][at.col] : null) {
      if (at) {
        path.push(at);
      }
    }
    path.reverse();
    return path;
  }

  /**
   * Helper function to calculate the Manhattan distance between two nodes.
   * The Manhattan distance is used as a heuristic to estimate the distance between two nodes.
   * The Manhattan distance is calculated as the sum of the absolute differences between the row and column of the two nodes.
   * @param a
   * @param b
   * @returns {number}
   */
  const manhattanDistanceHeuristic = (a, b) => {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  }

  /**
   * Helper function to calculate the Euclidean distance between two nodes.
   * The Euclidean distance is used as a heuristic to estimate the distance between two nodes.
   * The Euclidean distance is calculated as the square root of the sum of the squares of the differences between the row and column of the two nodes.
   * The Euclidean distance is used to estimate the distance between two nodes in a 2D plane.
   * @param a
   * @param b
   * @returns {number}
   */

  const euclideanDistanceHeuristic = (a, b) => {
    return Math.sqrt((a.row - b.row) ** 2 + (a.col - b.col) ** 2);
  }

  /**
   * Helper function to calculate the Euclidean distance squared between two nodes.
   * The Euclidean distance squared is used as a heuristic to estimate the distance between two nodes.
   * The Euclidean distance squared is calculated as the sum of the squares of the differences between the row and column of the two nodes.
   * The Euclidean distance squared is used to estimate the distance between two nodes in a 2D plane.
   * The Euclidean distance squared is faster to compute than the Euclidean distance.
   * @param a
   * @param b
   * @returns {number}
   */

  const euclideanDistanceSquaredHeuristic = (a, b) => {
    return (a.row - b.row) ** 2 + (a.col - b.col) ** 2;
  }

  const heuristic = euclideanDistanceHeuristic;

  /**
   * Helper function to calculate the weight of the edge between two nodes.
   * The weight of the edge is used to estimate the cost of moving from the current node to the neighbor node.
   * @param current
   * @param neighbor
   * @returns {number}
   */

  const weightFunction = (current, neighbor) => {
    return 0.7;
  }

  /**
   * Helper function to run the A* Search algorithm.
   * The A* Search algorithm is a pathfinding algorithm that explores the nodes with the lowest fScore value.
   * The algorithm uses a priority queue to explore the nodes with the lowest fScore value.
   * The algorithm stops when the end node is reached or when all the nodes have been explored.
   * The algorithm reconstructs the path from the start node to the end node by following the cameFrom map.
   * The path is displayed by changing the color of the nodes to yellow.
   * The A* Search algorithm is guaranteed to find the shortest path between the start and end nodes.
   * @param {Array} grid - The grid to search
   * @param {Object} start - The start node
   * @returns {void}
   * */
  const aStarSearch = (grid, start) => {
    const visited = Array(grid.length).fill().map(() => Array(grid[0].length).fill(false));
    const cameFrom = Array(grid.length).fill().map(() => Array(grid[0].length).fill(null));
    const gScore = Array(grid.length).fill().map(() => Array(grid[0].length).fill(Infinity));
    const fScore = Array(grid.length).fill().map(() => Array(grid[0].length).fill(Infinity));
    gScore[start.row][start.col] = 0;
    fScore[start.row][start.col] = heuristic(start, end);
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
        let tentativeGScore = gScore[currentNode.row][currentNode.col] + weightFunction(currentNode, neighbor);
        if (tentativeGScore < gScore[neighbor.row][neighbor.col]) {
          cameFrom[neighbor.row][neighbor.col] = currentNode;
          gScore[neighbor.row][neighbor.col] = tentativeGScore;
          fScore[neighbor.row][neighbor.col] = gScore[neighbor.row][neighbor.col] + heuristic(neighbor, end);
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

  /**
   * Helper function to run the Breadth-First Search algorithm.
   * The Breadth-First Search algorithm is a pathfinding algorithm that explores the nodes level by level.
   * The algorithm uses a queue to explore the nodes level by level.
   * The algorithm stops when the end node is reached or when all the nodes have been explored.
   * The algorithm reconstructs the path from the start node to the end node by following the prev map.
   * The path is displayed by changing the color of the nodes to yellow.
   * The Breadth-First Search algorithm is guaranteed to find the shortest path between the start and end nodes.
   * @param {Array} grid - The grid to search
   * @param {Object} start - The start node
   * @returns {void}
   */
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

  /**
   * Helper function to run the Greedy Best-First Search algorithm.
   * The Greedy Best-First Search algorithm is a pathfinding algorithm that explores the nodes with the lowest heuristic value.
   * The algorithm uses a priority queue to explore the nodes with the lowest heuristic value.
   * The algorithm stops when the end node is reached or when all the nodes have been explored.
   * The algorithm reconstructs the path from the start node to the end node by following the cameFrom map.
   * The path is displayed by changing the color of the nodes to yellow.
   * @param {Array} grid - The grid to search
   * @param {Object} start - The start node
   * @returns {void}
   * */
  const greedyBestFirstSearch = (grid, start) => {
    const visited = Array(grid.length).fill().map(() => Array(grid[0].length).fill(false));
    const cameFrom = Array(grid.length).fill().map(() => Array(grid[0].length).fill(null));
    const gScore = Array(grid.length).fill().map(() => Array(grid[0].length).fill(Infinity));
    const fScore = Array(grid.length).fill().map(() => Array(grid[0].length).fill(Infinity));
    gScore[start.row][start.col] = 0;
    fScore[start.row][start.col] = heuristic(start, end);
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
          fScore[neighbor.row][neighbor.col] = gScore[neighbor.row][neighbor.col] + heuristic(neighbor, end);
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

  /**
   * Helper function to run the Depth-First Search algorithm.
   * The Depth-First Search algorithm is a pathfinding algorithm that explores the nodes depth by depth.
   * The algorithm uses a stack to explore the nodes depth by depth.
   * The algorithm stops when the end node is reached or when all the nodes have been explored.
   * The algorithm reconstructs the path from the start node to the end node by following the prev map.
   * The path is displayed by changing the color of the nodes to yellow.
   * The Depth-First Search algorithm is not guaranteed to find the shortest path between the start and end nodes.
   * @param {Array} grid - The grid to search
   * @param {Object} start - The start node
   * @returns {void}
   */

  const depthFirstSearch = (grid, start) => {
    let stack = [start];
    let visited = Array(grid.length).fill().map(() => Array(grid[0].length).fill(false));
    let prev = Array(grid.length).fill().map(() => Array(grid[0].length).fill(null));
    visited[start.row][start.col] = true;
    while (stack.length > 0) {
      let currentNode = stack.pop();
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
          stack.push(neighbor);
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

  /**
   * Helper function to run the Dijkstra's Algorithm.
   * The Dijkstra's Algorithm is a pathfinding algorithm that explores the nodes with the lowest gScore value.
   * The algorithm uses a priority queue to explore the nodes with the lowest gScore value.
   * The algorithm stops when the end node is reached or when all the nodes have been explored.
   * The algorithm reconstructs the path from the start node to the end node by following the cameFrom map.
   * The path is displayed by changing the color of the nodes to yellow.
   * The Dijkstra's Algorithm is guaranteed to find the shortest path between the start and end nodes.
   * @param {Array} grid - The grid to search
   * @param {Object} start - The start node
   * @returns {void}
   */

  const dijkstra = (grid, start) => {
    const visited = Array(grid.length).fill().map(() => Array(grid[0].length).fill(false));
    const cameFrom = Array(grid.length).fill().map(() => Array(grid[0].length).fill(null));
    const gScore = Array(grid.length).fill().map(() => Array(grid[0].length).fill(Infinity));
    const fScore = Array(grid.length).fill().map(() => Array(grid[0].length).fill(Infinity));
    gScore[start.row][start.col] = 0;
    fScore[start.row][start.col] = heuristic(start, end);
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
        let tentativeGScore = gScore[currentNode.row][currentNode.col] + 1;
        if (tentativeGScore < gScore[neighbor.row][neighbor.col]) {
          cameFrom[neighbor.row][neighbor.col] = currentNode;
          gScore[neighbor.row][neighbor.col] = tentativeGScore;
          fScore[neighbor.row][neighbor.col] = gScore[neighbor.row][neighbor.col] + heuristic(neighbor, end);
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

  /**
   * Helper function to handle the mouse down event.
   * The mouse down event is used to change the color of the node when the mouse is pressed down.
   * @param {number} rowIndex - The row index of the tile
   * @param {number} colIndex - The column index of the tile
   * @returns {void}
   * */
  const handleMouseDown = (rowIndex, colIndex) => {
    setIsMouseDown(true);
    handleClick(rowIndex, colIndex);
  };

  /**
   * Helper function to handle the mouse over event.
   * The mouse over event is used to change the color of the node when the mouse is moved over the node.
   * @param {number} rowIndex - The row index of the tile
   * @param {number} colIndex - The column index of the tile
   * @returns {void}
   */

  const handleMouseOver = (rowIndex, colIndex) => {
    if (isMouseDown) {
      handleClick(rowIndex, colIndex);
    }
  };

  useEffect(() => {
    render()
  }, [grid]);

  /**
   * Helper function to check if there is a light blue node in the grid.
   * The light blue node is used to represent a visited node in the grid.
   * The function returns true if there is a light blue node in the grid, otherwise it returns false.
   * @param {Array} grid - The grid to check
   * @returns {boolean}
   */
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

  /**
   * Helper function to handle the click event.
   * The click event is used to toggle between white and black when the tile is clicked.
   * @param {number} rowIndex - The row index of the tile
   * @param {number} colIndex - The column index of the tile
   * @returns {void}
   */

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

  /**
   * Helper function to handle the drag start event.
   * The drag start event is used to set the dragging state when the tile is dragged.
   * @param {number} rowIndex - The row index of the tile
   * @param {number} colIndex - The column index of the tile
   * @returns {void}
   */
  const handleDragStart = (rowIndex, colIndex) => {
    setDragging({ rowIndex, colIndex });
  };

  /**
   * Helper function to handle the drop event.
   * The drop event is used to swap the positions of the start and end tiles when the tile is dropped.
   * The drop event is used to move the start and end tiles to a different position in the grid.
   * The drop event is used to change the color of the start and end tiles when the tile is dropped.
   * The drop event is used to update the start and end state when the tile is dropped.
   * The drop event is used to update the grid state when the tile is dropped.
   * @param {number} rowIndex - The row index of the tile
   * @param {number} colIndex - The column index of the tile
   * @returns {void}
   */

  const handleDrop = (rowIndex, colIndex) => {
    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      const temp = newGrid[dragging.rowIndex][dragging.colIndex];
      newGrid[dragging.rowIndex][dragging.colIndex] = newGrid[rowIndex][colIndex];
      newGrid[rowIndex][colIndex] = temp;
      if (newGrid[rowIndex][colIndex].color === Colors.RED) {
        setStart(newGrid[rowIndex][colIndex]);
      } else if (newGrid[rowIndex][colIndex].color === Colors.GREEN) {
        setEnd(newGrid[rowIndex][colIndex]);
      }
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
          <button id="clear-maze" onClick={
            () => {
              setGrid(initialGrid);
            }
          }>Clear Maze</button>
          <button id="run" onClick={
            () => {
                if (mazeSolver === 'breadth-first') {
                  setIsRunning(true);
                  breadthFirstSearch(grid, start);
                  setIsRunning(false);
                } else if (mazeSolver === 'a-star') {
                    setIsRunning(true);
                    aStarSearch(grid, start);
                    setIsRunning(false);
                } else if (mazeSolver === 'greedy-best-first') {
                    setIsRunning(true);
                    greedyBestFirstSearch(grid, start);
                    setIsRunning(false);
                } else if (mazeSolver === 'depth-first') {
                    setIsRunning(true);
                    depthFirstSearch(grid, start);
                    setIsRunning(false);
                } else if (mazeSolver === 'dijkstra') {
                    setIsRunning(true);
                    dijkstra(grid, start);
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