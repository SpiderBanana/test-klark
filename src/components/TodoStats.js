import React from "react";
import "./TodoStats.css";

function TodoStats({ todos }) {
  // BUG INTENTIONNEL: Calculs des statistiques manquants
  const calculateStats = () => {
    if (!todos || todos.length === 0) {
      return {
        total: 0,
        completed: 0,
        pending: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0,
        completionRate: 0,
      };
    }

    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const pending = total - completed;

    // BUG INTENTIONNEL: Calcul des priorités manquant
    const highPriority = todos.filter(
      (todo) => todo.priority === "high"
    ).length;
    const mediumPriority = todos.filter(
      (todo) => todo.priority === "medium"
    ).length;
    const lowPriority = todos.filter((todo) => todo.priority === "low").length;

    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      highPriority,
      mediumPriority,
      lowPriority,
      completionRate,
    };
  };

  // BUG INTENTIONNEL: Fonction de formatage des dates manquante
  const formatDate = (dateString) => {
    if (!dateString) return "Non définie";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return "Date invalide";
    }
  };

  // BUG INTENTIONNEL: Fonction de calcul des tâches en retard manquante
  const getOverdueTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return todos.filter((todo) => {
      if (!todo.dueDate || todo.completed) return false;

      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      return dueDate < today;
    }).length;
  };

  const stats = calculateStats();
  const overdueTasks = getOverdueTasks();

  return (
    <div className="card">
      <h2>Statistiques</h2>

      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total des tâches</div>
        </div>

        <div className="stat-item">
          <div className="stat-number completed">{stats.completed}</div>
          <div className="stat-label">Terminées</div>
        </div>

        <div className="stat-item">
          <div className="stat-number pending">{stats.pending}</div>
          <div className="stat-label">En cours</div>
        </div>

        <div className="stat-item">
          <div className="stat-number">{stats.completionRate}%</div>
          <div className="stat-label">Taux de complétion</div>
        </div>
      </div>

      <div className="priority-stats">
        <h3>Par Priorité</h3>
        <div className="priority-grid">
          <div className="priority-item high">
            <span className="priority-label">Haute</span>
            <span className="priority-count">{stats.highPriority}</span>
          </div>

          <div className="priority-item medium">
            <span className="priority-label">Moyenne</span>
            <span className="priority-count">{stats.mediumPriority}</span>
          </div>

          <div className="priority-item low">
            <span className="priority-label">Basse</span>
            <span className="priority-count">{stats.lowPriority}</span>
          </div>
        </div>
      </div>

      {overdueTasks > 0 && (
        <div className="overdue-warning">
          <span className="warning-icon">⚠️</span>
          <span>{overdueTasks} tâche(s) en retard</span>
        </div>
      )}

      {/* BUG INTENTIONNEL: Graphique de progression manquant */}
      <div className="progress-section">
        <h3>Progression</h3>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${stats.completionRate}%` }}
          ></div>
        </div>
        <div className="progress-text">
          {stats.completed} sur {stats.total} tâches terminées
        </div>
      </div>
    </div>
  );
}

export default TodoStats;
