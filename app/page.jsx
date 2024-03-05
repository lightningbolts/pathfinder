import Image from "next/image";
import InteractiveGrid from "../components/InteractiveGrid";

export default function Home() {
  return (
    <div>
      <div className="container">
        <div className="column-20">
          <h1>Pathfinder</h1>
          <select id="maze-solver">
            <option value="">Select a maze solver</option>
            {/* Add options for different maze solvers here */}
            <option value="dijkstra">Dijkstra's Algorithm</option>
            <option value="a-star">A* Search</option>
            <option value="greedy-best-first">Greedy Best-First Search</option>
            <option value="breadth-first">Breadth-First Search</option>
            <option value="depth-first">Depth-First Search</option>
          </select>
          <select id="maze-generator">
            <option value="">Select a maze generator</option>
            {/* Add options for different maze generators here */}
            <option value="recursive-division">Recursive Division</option>
            <option value="random-walk">Random Walk</option>
            <option value="prim">Prim's Algorithm</option>
            <option value="kruskal">Kruskal's Algorithm</option>
            <option value="eller">Eller's Algorithm</option>
          </select>
          <button id="clear-maze">Clear Maze</button>
          <button id="run">Run</button>
        </div>
        <div className="column-80">
          <InteractiveGrid />
        </div>
      </div>
    </div>
  );
}