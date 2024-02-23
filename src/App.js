import './App.css';
import Planet from "./Planet/Planet";

function App() {
  return (
    <div className="App">
      <div className="stars">
        {Array.from({ length: 50 }, (_, index) => (
          <div key={index} className="star"></div>
        ))}
      </div>
      <Planet />
    </div>
  );
}

export default App;
