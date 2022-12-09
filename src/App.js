import logo from './logo.svg';
import './App.css';
import './styles/styles.css'; // Custom  
import "./main.js"
import { ConnectionIndicator } from './GUI/ConnectionIndicator';


function App() {
  return (
    <div className="App">      
      <div className = " d-flex flex-column title">
          <h1> Handysion </h1>
          <p> Control Platform </p>
      </div>

      <ConnectionIndicator/> 
    </div>
  );
}

export default App;
