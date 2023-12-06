import { SketchPicker } from "react-color"

import { useDraw } from "./hooks/useDraw";

function App() {
  const { canvasRef, onMouseDown, color, setColor, clear, download } = useDraw();

  return (
    <div className="body">
      <div className="sidebar">
        <SketchPicker
          className="picker"
          color={color}
          onChange={e => {
            setColor(e.hex)
          }}
        />
        <button onClick={clear}>Clear</button>
        <button className="download" onClick={download}>Download</button>
      </div>
      <canvas
        onMouseDown={onMouseDown}
        ref={canvasRef}
        className="canvas"
        width={450}
        height={450}
      ></canvas>
    </div>
  );
}

export default App;
