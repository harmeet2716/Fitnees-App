import React, { useState, useEffect } from 'react';
import './FitnessTracker.css';

const FitnessTracker = ({ user, onUpdateWorkouts, onUpdateGoals }) => {
  // State for workouts
  const [workouts, setWorkouts] = useState(user?.workouts || []);
  const [workoutName, setWorkoutName] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [workoutType, setWorkoutType] = useState('cardio');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // State for goals
  const [dailyGoal, setDailyGoal] = useState(user?.goals?.daily || 30);
  const [weeklyGoal, setWeeklyGoal] = useState(user?.goals?.weekly || 150);

  // Update workouts when user changes
  useEffect(() => {
    if (user?.workouts) {
      setWorkouts(user.workouts);
    }
  }, [user]);

  // Update user workouts in localStorage
  const updateUserWorkouts = (updatedWorkouts) => {
    if (user) {
      const users = JSON.parse(localStorage.getItem('fitnessUsers') || '[]');
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, workouts: updatedWorkouts } : u
      );
      localStorage.setItem('fitnessUsers', JSON.stringify(updatedUsers));
      
      // Update current user
      const updatedUser = { ...user, workouts: updatedWorkouts };
      localStorage.setItem('currentFitnessUser', JSON.stringify(updatedUser));
    }
  };

  // Add a new workout
  const addWorkout = (e) => {
    e.preventDefault();
    if (!workoutName || !duration || !calories) return;

    const newWorkout = {
      id: Date.now(),
      name: workoutName,
      duration: parseInt(duration),
      calories: parseInt(calories),
      type: workoutType,
      date: date,
      userId: user?.id
    };

    // Use the prop to update workouts if provided, otherwise use local state
    if (onUpdateWorkouts) {
      onUpdateWorkouts(newWorkout);
    } else {
      // Fallback to local state
      const updatedWorkouts = [newWorkout, ...workouts];
      setWorkouts(updatedWorkouts);
      updateUserWorkouts(updatedWorkouts);
    }

    setWorkoutName('');
    setDuration('');
    setCalories('');
  };

  // Delete a workout
  const deleteWorkout = (id) => {
    const updatedWorkouts = workouts.filter(workout => workout.id !== id);
    setWorkouts(updatedWorkouts);
    
    // Use prop if available, otherwise update localStorage directly
    if (onUpdateWorkouts) {
      // If using prop, we need to simulate the update by calling the prop with all workouts
      // This might need adjustment based on how your parent component handles this
      const users = JSON.parse(localStorage.getItem('fitnessUsers') || '[]');
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, workouts: updatedWorkouts } : u
      );
      localStorage.setItem('fitnessUsers', JSON.stringify(updatedUsers));
    } else {
      updateUserWorkouts(updatedWorkouts);
    }
  };

  // Update goals
  const updateGoals = (newDailyGoal, newWeeklyGoal) => {
    setDailyGoal(newDailyGoal);
    setWeeklyGoal(newWeeklyGoal);
    
    if (user) {
      const users = JSON.parse(localStorage.getItem('fitnessUsers') || '[]');
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, goals: { daily: newDailyGoal, weekly: newWeeklyGoal } } : u
      );
      localStorage.setItem('fitnessUsers', JSON.stringify(updatedUsers));
      
      const updatedUser = { ...user, goals: { daily: newDailyGoal, weekly: newWeeklyGoal } };
      localStorage.setItem('currentFitnessUser', JSON.stringify(updatedUser));
      
      // Call the onUpdateGoals prop if provided
      if (onUpdateGoals) {
        onUpdateGoals({ daily: newDailyGoal, weekly: newWeeklyGoal });
      }
    }
  };

  // Calculate stats
  const todayWorkouts = workouts.filter(workout => workout.date === new Date().toISOString().split('T')[0]);
  const totalTodayMinutes = todayWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
  const totalTodayCalories = todayWorkouts.reduce((sum, workout) => sum + workout.calories, 0);

  const weeklyWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    const today = new Date();
    const weekAgo = new Date(today.setDate(today.getDate() - 7));
    return workoutDate >= weekAgo;
  });
  const totalWeeklyMinutes = weeklyWorkouts.reduce((sum, workout) => sum + workout.duration, 0);

  return (
    <div className="fitness-tracker">
      {/* Dashboard Stats */}
      <div className="dashboard">
        <div className="stat-card">
          <h3>Today's Progress</h3>
          <div className="progress-circle">
            <span className="progress-text">
              {totalTodayMinutes}/{dailyGoal} min
            </span>
          </div>
          <p>{totalTodayCalories} calories burned</p>
        </div>

        <div className="stat-card">
          <h3>Weekly Progress</h3>
          <div className="progress-circle">
            <span className="progress-text">
              {totalWeeklyMinutes}/{weeklyGoal} min
            </span>
          </div>
          <p>{weeklyWorkouts.length} workouts</p>
        </div>
        
        {/* Additional Stats Cards */}
        <div className="stat-card">
          <h3>Total Workouts</h3>
          <div className="progress-circle">
            <span className="progress-text">
              {workouts.length}
            </span>
          </div>
          <p>All time workouts</p>
        </div>

        <div className="stat-card">
          <h3>Calories Today</h3>
          <div className="progress-circle">
            <span className="progress-text">
              {totalTodayCalories}
            </span>
          </div>
          <p>Total calories burned</p>
        </div>
      </div>

      {/* Add Workout Form */}
      <div className="workout-form-container">
        <h2>Add New Workout</h2>
        <form onSubmit={addWorkout} className="workout-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Workout name (e.g., Morning Run)"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                min="1"
                max="300"
              />
            </div>

            <div className="form-group">
              <input
                type="number"
                placeholder="Calories burned"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                required
                min="1"
                max="5000"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <select 
                value={workoutType} 
                onChange={(e) => setWorkoutType(e.target.value)}
              >
                <option value="cardio">Cardio</option>
                <option value="strength">Strength</option>
                <option value="yoga">Yoga</option>
                <option value="sports">Sports</option>
                <option value="hiit">HIIT</option>
                <option value="flexibility">Flexibility</option>
              </select>
            </div>

            <div className="form-group">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <button type="submit" className="add-button">
            ➕ Add Workout
          </button>
        </form>
      </div>

      {/* Goals Section */}
      <div className="goals-section">
        <h2>Set Goals</h2>
        <div className="goals-form">
          <div className="form-group">
            <label>Daily Goal (minutes):</label>
            <input
              type="number"
              value={dailyGoal}
              onChange={(e) => updateGoals(parseInt(e.target.value) || 0, weeklyGoal)}
              min="5"
              max="300"
            />
          </div>
          <div className="form-group">
            <label>Weekly Goal (minutes):</label>
            <input
              type="number"
              value={weeklyGoal}
              onChange={(e) => updateGoals(dailyGoal, parseInt(e.target.value) || 0)}
              min="30"
              max="2000"
            />
          </div>
        </div>
      </div>

      {/* Workout History */}
      <div className="workout-history">
        <div className="workout-history-header">
          <h2>Workout History</h2>
          <span className="workout-count">Total: {workouts.length} workouts</span>
        </div>
        
        {workouts.length === 0 ? (
          <div className="no-workouts-container">
            <p className="no-workouts">No workouts yet. Add your first workout to get started! 🏃‍♂️</p>
            <div className="workout-suggestions">
              <p>Try adding:</p>
              <ul>
                <li>🏃‍♂️ 30-minute run</li>
                <li>💪 Strength training session</li>
                <li>🧘‍♀️ Yoga flow</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="workouts-list">
            {workouts.map(workout => (
              <div key={workout.id} className={`workout-item ${workout.type}`}>
                <div className="workout-info">
                  <div className="workout-header">
                    <h4>{workout.name}</h4>
                    <span className={`workout-type-badge ${workout.type}`}>
                      {workout.type}
                    </span>
                  </div>
                  <div className="workout-details">
                    <div className="workout-stat">
                      <span className="stat-label">Duration:</span>
                      <span className="stat-value">{workout.duration} min</span>
                    </div>
                    <div className="workout-stat">
                      <span className="stat-label">Calories:</span>
                      <span className="stat-value">{workout.calories} cal</span>
                    </div>
                    <div className="workout-stat">
                      <span className="stat-label">Date:</span>
                      <span className="stat-value">{workout.date}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => deleteWorkout(workout.id)}
                  className="delete-button"
                  title="Delete workout"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FitnessTracker;