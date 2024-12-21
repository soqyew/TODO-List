import React from "react";
import TodoItem from "./todoItem";
import search from "./search.png";

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      title: "",
      description: "",
      showCompleted: true,
      searchQuery: "",
      selectedUrgency: null, 
      currentUrgency: "medium",
      errorMessage: "",
    };
    this.descriptionInputRef = React.createRef();
  }

  handleAdd = () => {
    const { title, description, currentUrgency } = this.state;

    if (title.trim() === "") {
      this.setState({ errorMessage: "Название задачи не может быть пустым." });
      return;
    }

    const newTodo = {
      id: Date.now(),
      title: title.trim(),
      description,
      completed: false,
      urgency: currentUrgency,
      timestamp: new Date().toLocaleString(),
    };

    this.setState((prevState) => ({
      todos: prevState.todos.concat(newTodo),
      title: "",
      description: "",
      errorMessage: "",
      currentUrgency: "medium",
    }));
  };

  handleCreateBulkTodos = () => {
    const urgencyLevels = ["urgent", "medium", "not urgent"];
    const bulkTodos = Array.from({ length: 1000 }, (_, index) => {
      const randomUrgency =
        urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)];

      return {
        id: Date.now() + index,
        title: `Задача ${index + 1}`,
        description: `Описание задачи ${index + 1}`,
        completed: false,
        urgency: randomUrgency,
        timestamp: new Date().toLocaleString(),
      };
    });

    this.setState((prevState) => ({
      todos: prevState.todos.concat(bulkTodos),
    }));
  };

  handleToggle = (id) => {
    this.setState((prevState) => ({
      todos: prevState.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    }));
  };

  handleDelete = (id) => {
    this.setState((prevState) => ({
      todos: prevState.todos.filter((todo) => todo.id !== id),
    }));
  };

  handleFilter = () => {
    this.setState((prevState) => ({
      showCompleted: !prevState.showCompleted,
    }));
  };

  handleEdit = (id, newTitle, newDescription) => {
    this.setState((prevState) => ({
      todos: prevState.todos.map((todo) =>
        todo.id === id
          ? { ...todo, title: newTitle, description: newDescription }
          : todo
      ),
    }));
  };

  handleSearch = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  handleUrgencyChange = (urgency) => {
    this.setState({ selectedUrgency: urgency.toLowerCase() }); 
  };

  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      this.descriptionInputRef.current.focus();
    }
  };

  render() {
    const {
      todos,
      title,
      description,
      showCompleted,
      searchQuery,
      selectedUrgency,
      currentUrgency,
      errorMessage,
    } = this.state;

    const filteredTodos = todos.filter((todo) => {
      const titleMatch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());
      const descriptionMatch = todo.description.toLowerCase().includes(searchQuery.toLowerCase());
      const urgencyMatch = !selectedUrgency || todo.urgency === selectedUrgency; 

      return (titleMatch || descriptionMatch) && urgencyMatch;
    });

    const incompleteTodos = filteredTodos.filter((todo) => !todo.completed);
    const completedTodos = filteredTodos.filter((todo) => todo.completed);
    const displayedTodos = showCompleted
      ? [...incompleteTodos, ...completedTodos]
      : incompleteTodos;

    const urgencyValues = ["urgent", "medium", "not urgent"]; 

    return (
      <div className="todo-list">
        <h1>TODO List</h1>
        <input
          type="text"
          placeholder="Task name"
          value={title}
          onChange={(e) => this.setState({ title: e.target.value })}
          onKeyDown={this.handleKeyPress}
        />
        <textarea
          ref={this.descriptionInputRef}
          placeholder="Description"
          value={description}
          onChange={(e) => this.setState({ description: e.target.value })}
        />

        <select
          onChange={(e) => this.setState({ currentUrgency: e.target.value })}
          value={currentUrgency}
        >
          <option value="urgent">Urgent</option>
          <option value="medium">Medium</option>
          <option value="not urgent">Not urgent</option>
        </select>

        <div className="button-container">
          <div className="top-buttons">
            <button className="full-width" onClick={this.handleAdd}>
              Add
            </button>
            <button className="full-width" onClick={this.handleCreateBulkTodos}>
              Create 1000 tasks
            </button>
          </div>
          <button className="full-width" onClick={this.handleFilter}>
            {showCompleted ? "Only uncompleted" : "Show all"}
          </button>
        </div>

        <div className="search-container">
          <img src={search} alt="Search" className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={this.handleSearch}
          />
        </div>

        {todos.length > 0 && (
          <div className="urgency-filters">
            <h3>Filter by urgency:</h3>
            <div className="urgency-button-container">
              {urgencyValues.map((urgency) => (
                <button
                  key={urgency}
                  onClick={() => this.handleUrgencyChange(urgency)}
                  style={{
                    backgroundColor:
                      selectedUrgency === urgency ? "#007BFF" : "#FFF",
                    color: selectedUrgency === urgency ? "#FFF" : "#000",
                    border: "1px solid #007BFF",
                    padding: "10px 15px",
                    margin: "5px",
                    cursor: "pointer",
                  }}
                >
                  {urgency.charAt(0).toUpperCase() + urgency.slice(1)} 
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="todo-items">
          {displayedTodos.map((item) => (
            <TodoItem
              key={item.id}
              item={item}
              onToggle={this.handleToggle}
              onDelete={this.handleDelete}
              onEdit={this.handleEdit}
            />
          ))}
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    );
  }
}

export default TodoList;