import React, { useState, useEffect } from "react";
import "./App.css";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import TodoStats from "./components/TodoStats";

function App() {
  // Bug Facile - Les données ne se chargent pas (états initiaux incorrects)
  const [todos, setTodos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    // Bug Difficile - Persistance des données manquante
    // Charger les données depuis localStorage au démarrage
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(parsedTodos);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des todos sauvegardés:', error);
        fetchTodos();
      }
    } else {
      fetchTodos();
    }
  }, []);

  // Bug Difficile - Persistance des données manquante
  // Sauvegarder les todos dans localStorage à chaque modification
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      // Bug Moyen - Gestion d'erreur incomplète
      setError(null);
      // Bug Facile - L'API ne répond pas (URL incorrecte)
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );
      
      // Bug Moyen - Gestion d'erreur incomplète
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setTodos(data.slice(0, 5));
    } catch (err) {
      setError(err.message);
      // Bug Moyen - Gestion d'erreur incomplète
      console.error("Erreur lors du chargement des todos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Bug Facile - Les nouvelles tâches ne s'ajoutent pas (fonction addTodo incorrecte)
  const addTodo = (todoData) => {
    const newTodo = {
      id: Date.now(),
      title: todoData.title,
      description: todoData.description,
      priority: todoData.priority,
      dueDate: todoData.dueDate,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  // Bug Moyen - toggleTodo modifie l'objet directement (problème d'immutabilité)
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  // Bug Moyen - Fonction deleteTodo manquante
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Bug Moyen - Fonction updateTodo manquante
  const updateTodo = (id, updatedData) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, ...updatedData }
        : todo
    ));
  };

  // Bonus - Ajout d'un bouton pour effacer les données sauvegardées
  const clearAllData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer toutes les données ?')) {
      localStorage.removeItem('todos');
      setTodos([]);
    }
  };

  // Bug Moyen - États de chargement non gérés
  if (loading) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Todo App - Test Technique</h1>
          <p>Chargement en cours...</p>
        </header>
        <main className="App-main">
          <div className="card">
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div>Chargement des données...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Bug Moyen - États de chargement non gérés
  if (error) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Todo App - Test Technique</h1>
          <p>Une erreur est survenue</p>
        </header>
        <main className="App-main">
          <div className="card">
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--klark-error)' }}>
              <h3>Erreur de chargement</h3>
              <p>{error}</p>
              <button 
                onClick={fetchTodos} 
                className="btn btn-primary"
                style={{ marginTop: '20px' }}
              >
                Réessayer
              </button>
            </div>
          </div>
        </main>
      </div>
    );
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
          onToggleTodo={toggleTodo}
          onDeleteTodo={deleteTodo}
          onUpdateTodo={updateTodo}
          loading={false}
        />

        <TodoStats todos={todos} />
        
        {/* Bonus - Ajout d'un bouton pour effacer les données sauvegardées */}
        <div className="card" style={{ textAlign: 'center' }}>
          <button 
            onClick={clearAllData} 
            className="btn btn-secondary"
            style={{ marginRight: '10px' }}
          >
            Effacer toutes les données
          </button>
          <button 
            onClick={fetchTodos} 
            className="btn btn-primary"
          >
            Recharger les données d'exemple
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
