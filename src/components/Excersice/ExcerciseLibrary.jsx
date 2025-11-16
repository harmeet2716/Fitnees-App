import React, { useState } from 'react';
import './ExcerciseLibrary.css';

const ExerciseLibrary = ({ onAddExercise }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const exerciseCategories = [
    'all', 'chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio', 'yoga'
  ];

  const exerciseLibrary = [
    {
      id: 1,
      name: "Bench Press",
      category: "chest",
      type: "strength",
      difficulty: "intermediate",
      description: "Classic chest exercise using barbell",
      muscles: ["Pectorals", "Triceps", "Shoulders"],
      equipment: ["Barbell", "Bench"],
      caloriesPerMinute: 8
    },
    {
      id: 2,
      name: "Running",
      category: "cardio",
      type: "cardio",
      difficulty: "beginner",
      description: "Cardiovascular endurance training",
      muscles: ["Legs", "Core", "Cardiovascular"],
      equipment: ["None"],
      caloriesPerMinute: 12
    },
    {
      id: 3,
      name: "Push-ups",
      category: "chest",
      type: "bodyweight",
      difficulty: "beginner",
      description: "Bodyweight chest and arm exercise",
      muscles: ["Pectorals", "Triceps", "Shoulders", "Core"],
      equipment: ["None"],
      caloriesPerMinute: 7
    },
    {
      id: 4,
      name: "Squats",
      category: "legs",
      type: "strength",
      difficulty: "beginner",
      description: "Fundamental leg exercise",
      muscles: ["Quads", "Glutes", "Hamstrings"],
      equipment: ["Barbell", "Bodyweight"],
      caloriesPerMinute: 6
    },
    {
      id: 5,
      name: "Plank",
      category: "core",
      type: "bodyweight",
      difficulty: "beginner",
      description: "Core stability exercise",
      muscles: ["Abs", "Core", "Shoulders"],
      equipment: ["None"],
      caloriesPerMinute: 3
    }
  ];

  const filteredExercises = exerciseLibrary.filter(exercise => {
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddExercise = (exercise) => {
    if (onAddExercise) {
      onAddExercise(exercise);
    }
    alert(`✅ "${exercise.name}" added! Switch to Dashboard to log this exercise.`);
  };

  return (
    <div className="exercise-library">
      <div className="library-header">
        <h2>💪 Exercise Library</h2>
        <p>Browse exercises and add them to your workout log</p>
      </div>

      <div className="library-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="category-filters">
          {exerciseCategories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="exercises-grid">
        {filteredExercises.length === 0 ? (
          <div className="no-exercises">
            <p>No exercises found matching your criteria.</p>
            <button 
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
              }}
              className="clear-filters-btn"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredExercises.map(exercise => (
            <div key={exercise.id} className="exercise-card">
              <div className="exercise-header">
                <h4>{exercise.name}</h4>
                <span className={`difficulty-badge ${exercise.difficulty}`}>
                  {exercise.difficulty}
                </span>
              </div>
              
              <div className="exercise-details">
                <p className="exercise-description">{exercise.description}</p>
                
                <div className="exercise-meta">
                  <span className="exercise-category">{exercise.category}</span>
                  <span className="exercise-type">{exercise.type}</span>
                </div>

                <div className="exercise-info">
                  <div className="info-item">
                    <strong>Muscles:</strong> 
                    <span>{exercise.muscles.join(', ')}</span>
                  </div>
                  <div className="info-item">
                    <strong>Equipment:</strong> 
                    <span>{exercise.equipment.join(', ')}</span>
                  </div>
                  <div className="info-item">
                    <strong>Calories:</strong> 
                    <span>~{exercise.caloriesPerMinute} cal/min</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleAddExercise(exercise)}
                className="add-exercise-btn"
              >
                ➕ Add to Workout
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExerciseLibrary;