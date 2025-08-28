import React, { useState } from "react";
import "./TodoForm.css";
import { generateDescription } from "../services/openaiService";

function TodoForm({ onAdd }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  // Bug Facile - Les formulaires ne répondent pas aux saisies (TodoForm)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Bug Difficile - Validation des données manquante (TodoForm)
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis";
    } else if (formData.title.length > 100) {
      newErrors.title = "Le titre ne peut pas dépasser 100 caractères";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "La description ne peut pas dépasser 500 caractères";
    }

    if (formData.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(formData.dueDate);
      
      if (dueDate < today) {
        newErrors.dueDate = "La date d'échéance ne peut pas être dans le passé";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onAdd({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate,
      });
      
      // Bonus - Réinitialisation du formulaire après soumission réussie
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
      });
      setErrors({});
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.title.trim()) {
      setErrors({...errors, title: "Entrez d'abord un titre"});
      return;
    }

    setIsGenerating(true);
    const description = await generateDescription(formData.title);
    
    if (description) {
      setFormData({...formData, description});
    }
    
    setIsGenerating(false);
  };

  return (
    <div className="card">
      <h2>Nouvelle Tâche</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Titre *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Entrez le titre de la tâche"
            className={errors.title ? "error" : ""}
          />
          {errors.title && (
            <span className="error-message">{errors.title}</span>
          )}
        </div>

        {/* Bonus - Ajout de la validation visuelle dans le formulaire */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <div style={{display: 'flex', gap: '10px', alignItems: 'flex-end'}}>
            <div style={{flex: 1}}>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description optionnelle"
                rows="3"
                className={errors.description ? "error" : ""}
              />
            </div>
            <button 
              type="button"
              onClick={handleGenerateDescription}
              disabled={isGenerating || !formData.title.trim()}
              className="btn btn-secondary"
              style={{height: 'fit-content', whiteSpace: 'nowrap'}}
            >
              {isGenerating ? 'Génération...' : 'IA'}
            </button>
          </div>
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priorité</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
          >
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
        </div>

        {/* Bonus - Ajout de la validation visuelle dans le formulaire */}
        <div className="form-group">
          <label htmlFor="dueDate">Date d'échéance</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            className={errors.dueDate ? "error" : ""}
          />
          {errors.dueDate && (
            <span className="error-message">{errors.dueDate}</span>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Créer la tâche
        </button>
      </form>
    </div>
  );
}

export default TodoForm;
