import './App.css';
import { sinewave_data } from './sinewave';
import {LinePlot} from './LinePlot.js'
import {ClockNode} from './Nodes/ClockNode.js'

function App() {

  return (
    <div className="App">
      <LinePlot data={sinewave_data}/>
    </div>
  );
}

export default App;