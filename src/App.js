import React, { useState, useEffect } from "react";
import "./App.css";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import TodoStats from "./components/TodoStats";

function App() {
  const [todos, setTodos] = useState(undefined);

  const [loading, setLoading] = useState(undefined);

  const [error, setError] = useState(undefined);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todosss"
      );
      const data = await response.json();
      setTodos(data.slice(0, 5));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      title: text,
      completed: false,
    };
    todos.push(newTodo);
    setTodos(todos);
  };

  const toggleTodo = (id) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      setTodos([...todos]);
    }
  };

  const deleteTodo = (id) => {};

  const updateTodo = (id, newText) => {};

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo App - Test Technique</h1>
        <p>Trouvez et corrigez les bugs !</p>
      </header>

      <main className="App-main">
        <TodoForm onAdd={addTodo} />

        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />

        <TodoStats todos={todos} />
      </main>
    </div>
  );
}

export default App;
