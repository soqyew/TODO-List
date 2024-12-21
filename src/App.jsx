import React from "react";
import TodoList from "./components/todoList";

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <TodoList />
      </div>
    );
  }
}

export default App;
