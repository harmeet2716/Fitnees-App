import React, { useState, useEffect } from 'react';

const PersonalRecords = ({ user }) => {
  const [personalRecords, setPersonalRecords] = useState(user?.personalRecords || []);
  const [showForm, setShowForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    exercise: '',
    value: '',
    unit: 'kg',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const commonExercises = [
    'Bench Press', 'Squat', 'Deadlift', 'Pull-ups', 'Push-ups',
    'Plank', 'Running 5K', 'Running 10K', 'Bicep Curls', 'Shoulder Press'
  ];

  useEffect(() => {
    // Auto-detect PRs from workouts
    detectRecordsFromWorkouts();
  }, [user?.workouts]);

  const detectRecordsFromWorkouts = () => {
    const workouts = user?.workouts || [];
    const detectedRecords = [];
    
    // Simple detection logic - in real app, this would be more sophisticated
    workouts.forEach(workout => {
      if (workout.duration > 60) {
        detectedRecords.push({
          id: `auto-${workout.id}-duration`,
          exercise: 'Longest Workout',
          value: workout.duration,
          unit: 'minutes',
          date: workout.date,
          notes: `Auto-detected from ${workout.name}`,
          autoDetected: true
        });
      }
    });

    setPersonalRecords(prev => {
      const existingIds = new Set(prev.map(r => r.id));
      const newRecords = detectedRecords.filter(r => !existingIds.has(r.id));
      return [...prev, ...newRecords];
    });
  };

  const addPersonalRecord = (e) => {
    e.preventDefault();
    const record = {
      id: Date.now(),
      ...newRecord,
      value: parseFloat(newRecord.value) || 0,
      autoDetected: false
    };

    const updatedRecords = [...personalRecords, record];
    setPersonalRecords(updatedRecords);
    updateUserRecords(updatedRecords);
    setShowForm(false);
    setNewRecord({
      exercise: '',
      value: '',
      unit: 'kg',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const updateUserRecords = (updatedRecords) => {
    console.log('Updated personal records:', updatedRecords);
  };

  const deleteRecord = (id) => {
    const updatedRecords = personalRecords.filter(record => record.id !== id);
    setPersonalRecords(updatedRecords);
    updateUserRecords(updatedRecords);
  };

  const getRecordsByCategory = () => {
    const categories = {
      strength: personalRecords.filter(r => ['kg', 'lbs', 'reps'].includes(r.unit)),
      endurance: personalRecords.filter(r => ['minutes', 'seconds', 'km', 'miles'].includes(r.unit)),
      bodyweight: personalRecords.filter(r => r.exercise.toLowerCase().includes('push') || 
                                            r.exercise.toLowerCase().includes('pull') ||
                                            r.exercise.toLowerCase().includes('plank'))
    };
    return categories;
  };

  const categories = getRecordsByCategory();

  return (
    <div className="progress-section">
      <div className="section-header">
        <h2>🎯 Personal Records</h2>
        <p>Celebrate your achievements and track your best performances</p>
      </div>

      {/* Add PR Button */}
      <div className="add-section">
        <button
          onClick={() => setShowForm(!showForm)}
          className="add-record-btn"
        >
          {showForm ? '❌ Cancel' : '🏆 Add New Record'}
        </button>
      </div>

      {/* Add Record Form */}
      {showForm && (
        <form onSubmit={addPersonalRecord} className="record-form">
          <h3>Add Personal Record</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Exercise</label>
              <select
                value={newRecord.exercise}
                onChange={(e) => setNewRecord({...newRecord, exercise: e.target.value})}
                required
              >
                <option value="">Select Exercise</option>
                {commonExercises.map(exercise => (
                  <option key={exercise} value={exercise}>{exercise}</option>
                ))}
                <option value="other">Other</option>
              </select>
              
              {newRecord.exercise === 'other' && (
                <input
                  type="text"
                  placeholder="Enter exercise name"
                  onChange={(e) => setNewRecord({...newRecord, exercise: e.target.value})}
                  className="other-input"
                />
              )}
            </div>
            
            <div className="form-group">
              <label>Value</label>
              <input
                type="number"
                step="0.1"
                value={newRecord.value}
                onChange={(e) => setNewRecord({...newRecord, value: e.target.value})}
                placeholder="e.g., 100"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Unit</label>
              <select
                value={newRecord.unit}
                onChange={(e) => setNewRecord({...newRecord, unit: e.target.value})}
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
                <option value="reps">reps</option>
                <option value="minutes">minutes</option>
                <option value="seconds">seconds</option>
                <option value="km">km</option>
                <option value="miles">miles</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date Achieved</label>
              <input
                type="date"
                value={newRecord.date}
                onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea
              value={newRecord.notes}
              onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
              placeholder="How did it feel? Any special conditions?"
              rows="3"
            />
          </div>

          <button type="submit" className="save-btn">
            🏆 Save Record
          </button>
        </form>
      )}

      {/* Records by Category */}
      <div className="records-categories">
        {/* Strength Records */}
        {categories.strength.length > 0 && (
          <div className="record-category">
            <h3>💪 Strength Records</h3>
            <div className="records-grid">
              {categories.strength.map(record => (
                <div key={record.id} className="record-card strength">
                  <div className="record-header">
                    <h4>{record.exercise}</h4>
                    {record.autoDetected && <span className="auto-badge">Auto</span>}
                    <button
                      onClick={() => deleteRecord(record.id)}
                      className="delete-btn"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="record-value">
                    {record.value} {record.unit}
                  </div>
                  <div className="record-date">{record.date}</div>
                  {record.notes && (
                    <div className="record-notes">
                      <p>{record.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Endurance Records */}
        {categories.endurance.length > 0 && (
          <div className="record-category">
            <h3>🏃 Endurance Records</h3>
            <div className="records-grid">
              {categories.endurance.map(record => (
                <div key={record.id} className="record-card endurance">
                  <div className="record-header">
                    <h4>{record.exercise}</h4>
                    {record.autoDetected && <span className="auto-badge">Auto</span>}
                    <button
                      onClick={() => deleteRecord(record.id)}
                      className="delete-btn"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="record-value">
                    {record.value} {record.unit}
                  </div>
                  <div className="record-date">{record.date}</div>
                  {record.notes && (
                    <div className="record-notes">
                      <p>{record.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bodyweight Records */}
        {categories.bodyweight.length > 0 && (
          <div className="record-category">
            <h3>🧘 Bodyweight Records</h3>
            <div className="records-grid">
              {categories.bodyweight.map(record => (
                <div key={record.id} className="record-card bodyweight">
                  <div className="record-header">
                    <h4>{record.exercise}</h4>
                    {record.autoDetected && <span className="auto-badge">Auto</span>}
                    <button
                      onClick={() => deleteRecord(record.id)}
                      className="delete-btn"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="record-value">
                    {record.value} {record.unit}
                  </div>
                  <div className="record-date">{record.date}</div>
                  {record.notes && (
                    <div className="record-notes">
                      <p>{record.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {personalRecords.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🏆</div>
            <h3>No Personal Records Yet</h3>
            <p>Start tracking your personal bests to celebrate your achievements!</p>
            <div className="empty-suggestions">
              <p><strong>Common records to track:</strong></p>
              <ul>
                <li>💪 Max bench press / squat / deadlift</li>
                <li>🏃 Fastest 5K run time</li>
                <li>🧘 Longest plank hold</li>
                <li>📈 Most push-ups in one set</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Achievement Stats */}
      {personalRecords.length > 0 && (
        <div className="achievement-stats">
          <h3>🎊 Achievement Summary</h3>
          <div className="stats-grid">
            <div className="achievement-stat">
              <span className="stat-number">{personalRecords.length}</span>
              <span className="stat-label">Total Records</span>
            </div>
            <div className="achievement-stat">
              <span className="stat-number">
                {personalRecords.filter(r => !r.autoDetected).length}
              </span>
              <span className="stat-label">Manual Records</span>
            </div>
            <div className="achievement-stat">
              <span className="stat-number">
                {personalRecords.filter(r => r.autoDetected).length}
              </span>
              <span className="stat-label">Auto-Detected</span>
            </div>
            <div className="achievement-stat">
              <span className="stat-number">
                {new Set(personalRecords.map(r => r.exercise)).size}
              </span>
              <span className="stat-label">Different Exercises</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalRecords;