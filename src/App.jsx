import React, { useState, useEffect } from 'react';
import FitnessTracker from './components/FitnessTracker/FitnessTracker';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserProfile from './components/Profile/UserProfile';
import ExerciseLibrary from './components/Excersice/ExcerciseLibrary';
import ProgressPage from './components/Progress/ProgressPage';
import ProgressPhotosPage from "./components/Progress/ProgressPhotosPage";

import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [users, setUsers] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');

  // Load users from localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('fitnessUsers');
    const currentUserData = localStorage.getItem('currentFitnessUser');
    
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (currentUserData) {
      setCurrentUser(JSON.parse(currentUserData));
      setAuthMode('app');
    }
  }, []);

  // Handle user registration
  const handleRegister = (userData) => {
    const newUser = {
      id: Date.now(),
      ...userData,
      joinedDate: new Date().toISOString(),
      workouts: [],
      goals: { 
        daily: 30, 
        weekly: 150,
        calories: 500,
        steps: 10000
      },
      profilePicture: '',
      bodyMeasurements: [],
      progressPhotos: [],
      personalRecords: [],
      friends: [],
      challenges: []
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('fitnessUsers', JSON.stringify(updatedUsers));
    
    handleLogin({ email: userData.email, password: userData.password });
  };

  // Handle user login
  const handleLogin = (credentials) => {
    const user = users.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentFitnessUser', JSON.stringify(user));
      setAuthMode('app');
    } else {
      alert('Invalid email or password!');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentFitnessUser');
    setAuthMode('login');
    setCurrentView('dashboard');
  };

  // Update user profile
  const handleUpdateProfile = (updatedData) => {
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentFitnessUser', JSON.stringify(updatedUser));

    const updatedUsers = users.map(u => 
      u.id === currentUser.id ? updatedUser : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('fitnessUsers', JSON.stringify(updatedUsers));
  };

  // Update user workouts
  const handleUpdateWorkouts = (newWorkout) => {
    if (!currentUser) return;

    const updatedWorkouts = [newWorkout, ...currentUser.workouts];
    const updatedUser = { ...currentUser, workouts: updatedWorkouts };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('currentFitnessUser', JSON.stringify(updatedUser));

    const updatedUsers = users.map(u => 
      u.id === currentUser.id ? updatedUser : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('fitnessUsers', JSON.stringify(updatedUsers));
  };

  // Update user progress photos
  const handleUpdateProgressPhotos = (updatedPhotos) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, progressPhotos: updatedPhotos };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentFitnessUser', JSON.stringify(updatedUser));

    const updatedUsers = users.map(u => 
      u.id === currentUser.id ? updatedUser : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('fitnessUsers', JSON.stringify(updatedUsers));
  };

  // Update user body measurements
  const handleUpdateBodyMeasurements = (updatedMeasurements) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, bodyMeasurements: updatedMeasurements };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentFitnessUser', JSON.stringify(updatedUser));

    const updatedUsers = users.map(u => 
      u.id === currentUser.id ? updatedUser : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('fitnessUsers', JSON.stringify(updatedUsers));
  };

  // Update user personal records
  const handleUpdatePersonalRecords = (updatedRecords) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, personalRecords: updatedRecords };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentFitnessUser', JSON.stringify(updatedUser));

    const updatedUsers = users.map(u => 
      u.id === currentUser.id ? updatedUser : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('fitnessUsers', JSON.stringify(updatedUsers));
  };

  // Add exercise from library to workout
  const handleAddExercise = (exercise) => {
    alert(`✅ "${exercise.name}" added! Switch to Dashboard to log this exercise.`);
  };

  // Update user goals
  const handleUpdateGoals = (newGoals) => {
    if (!currentUser) return;

    const updatedUser = { 
      ...currentUser, 
      goals: { ...currentUser.goals, ...newGoals } 
    };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('currentFitnessUser', JSON.stringify(updatedUser));

    const updatedUsers = users.map(u => 
      u.id === currentUser.id ? updatedUser : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('fitnessUsers', JSON.stringify(updatedUsers));
  };

  // Navigation component
  const NavigationMenu = () => (
    <nav className="app-navigation">
      <button 
        className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
        onClick={() => setCurrentView('dashboard')}
      >
        📊 Dashboard
      </button>
      <button 
        className={`nav-btn ${currentView === 'exercises' ? 'active' : ''}`}
        onClick={() => setCurrentView('exercises')}
      >
        💪 Exercises
      </button>
      <button 
        className={`nav-btn ${currentView === 'progress-photos' ? 'active' : ''}`}
        onClick={() => setCurrentView('progress-photos')}
      >
        📸 Progress Photos
      </button>
      <button 
        className={`nav-btn ${currentView === 'progress' ? 'active' : ''}`}
        onClick={() => setCurrentView('progress')}
      >
        📈 Progress
      </button>
      <button 
        className={`nav-btn ${currentView === 'nutrition' ? 'active' : ''}`}
        onClick={() => setCurrentView('nutrition')}
      >
        🍎 Nutrition
      </button>
    </nav>
  );

  // Render main app content based on current view
  const renderAppContent = () => {
    switch (currentView) {
      case 'exercises':
        return <ExerciseLibrary onAddExercise={handleAddExercise} />;
      
      case 'progress-photos':
        return (
          <ProgressPhotosPage 
            user={currentUser}
            onUpdateProgressPhotos={handleUpdateProgressPhotos}
          />
        );
      
      case 'progress':
        return (
          <ProgressPage 
            user={currentUser}
            onUpdateBodyMeasurements={handleUpdateBodyMeasurements}
            onUpdatePersonalRecords={handleUpdatePersonalRecords}
            onUpdateProgressPhotos={handleUpdateProgressPhotos}
          />
        );
      
      case 'nutrition':
        return (
          <div className="feature-coming-soon">
            <div className="coming-soon-card">
              <h2>🍎 Nutrition Tracker</h2>
              <p>Track your meals, water intake, and nutrition goals</p>
              <div className="coming-soon-features">
                <div className="feature-item">🍽️ Food Diary</div>
                <div className="feature-item">💧 Water Tracker</div>
                <div className="feature-item">📋 Meal Planning</div>
                <div className="feature-item">🎯 Calorie Goals</div>
              </div>
              <button 
                className="coming-soon-btn"
                onClick={() => alert('Nutrition tracking coming in the next update! 🚀')}
              >
                Coming Soon!
              </button>
            </div>
          </div>
        );
      
      case 'dashboard':
      default:
        return (
          <FitnessTracker 
            user={currentUser} 
            onUpdateWorkouts={handleUpdateWorkouts}
            onUpdateGoals={handleUpdateGoals}
          />
        );
    }
  };

  // Render based on auth state
  const renderContent = () => {
    switch (authMode) {
      case 'login':
        return (
          <Login 
            onLogin={handleLogin}
            switchToRegister={() => setAuthMode('register')}
          />
        );
      
      case 'register':
        return (
          <Register 
            onRegister={handleRegister}
            switchToLogin={() => setAuthMode('login')}
          />
        );
      
      case 'profile':
        return (
          <UserProfile 
            user={currentUser}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
            onBack={() => setAuthMode('app')}
          />
        );
      
      case 'app':
        return (
          <div className="app-with-profile">
            <div className="app-header-bar">
              <div className="header-left">
                <h1>💪 Elite Fitness</h1>
                <NavigationMenu />
              </div>
              
              <div className="user-menu">
                <span className="welcome-text">
                  Welcome back, <strong>{currentUser?.name}</strong>!
                </span>
                <div className="user-actions">
                  <button 
                    onClick={() => setAuthMode('profile')}
                    className="profile-button"
                  >
                    👤 Profile
                  </button>
                  <button onClick={handleLogout} className="logout-btn-small">
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>

            <main className="app-main-content">
              {renderAppContent()}
            </main>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="App">
      {renderContent()}
    </div>
  );
}

export default App;



   