import React, { useState } from "react";
import "./TodoItem.css";

function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  // BUG INTENTIONNEL: État d'édition manquant
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description || "",
    priority: todo.priority || "medium",
    dueDate: todo.dueDate || "",
  });

  // BUG INTENTIONNEL: Fonction de sauvegarde manquante
  const handleSave = () => {
    onUpdate(todo.id, editData);
    setIsEditing(false);
  };

  // BUG INTENTIONNEL: Fonction d'annulation manquante
  const handleCancel = () => {
    setEditData({
      title: todo.title,
      description: todo.description || "",
      priority: todo.priority || "medium",
      dueDate: todo.dueDate || "",
    });
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "var(--klark-error)";
      case "medium":
        return "var(--klark-warning)";
      case "low":
        return "var(--klark-success)";
      default:
        return "var(--klark-gray)";
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "high":
        return "Haute";
      case "medium":
        return "Moyenne";
      case "low":
        return "Basse";
      default:
        return "Non définie";
    }
  };

  if (isEditing) {
    return (
      <div className="todo-item editing">
        <div className="edit-form">
          <input
            type="text"
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            className="edit-title"
          />

          <textarea
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
            className="edit-description"
            placeholder="Description"
            rows="2"
          />

          <div className="edit-controls">
            <select
              value={editData.priority}
              onChange={(e) =>
                setEditData({ ...editData, priority: e.target.value })
              }
            >
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>

            <input
              type="date"
              value={editData.dueDate}
              onChange={(e) =>
                setEditData({ ...editData, dueDate: e.target.value })
              }
            />
          </div>

          <div className="edit-actions">
            <button onClick={handleSave} className="btn btn-primary">
              Sauvegarder
            </button>
            <button onClick={handleCancel} className="btn btn-secondary">
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <div className="todo-content">
        <div className="todo-header">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
            />
            <span className="checkmark"></span>
          </label>

          <div className="todo-info">
            <h3 className={`todo-title ${todo.completed ? "completed" : ""}`}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className="todo-description">{todo.description}</p>
            )}
          </div>

          <div className="todo-meta">
            <span
              className="priority-badge"
              style={{ backgroundColor: getPriorityColor(todo.priority) }}
            >
              {getPriorityLabel(todo.priority)}
            </span>

            {todo.dueDate && (
              <span className="due-date">
                Échéance: {new Date(todo.dueDate).toLocaleDateString("fr-FR")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="todo-actions">
        <button
          onClick={() => setIsEditing(true)}
          className="btn btn-secondary"
        >
          Modifier
        </button>
        <button onClick={() => onDelete(todo.id)} className="btn btn-secondary">
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
