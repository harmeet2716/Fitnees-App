import React, { useState } from 'react';

const BodyMeasurements = ({ user }) => {
  const [measurements, setMeasurements] = useState(user?.bodyMeasurements || []);
  const [showForm, setShowForm] = useState(false);
  const [currentMeasurement, setCurrentMeasurement] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    chest: '',
    waist: '',
    hips: '',
    arms: '',
    thighs: '',
    neck: '',
    activityLevel: 'moderate',
    notes: ''
  });

  const addMeasurement = (e) => {
    e.preventDefault();
    const newMeasurement = {
      id: Date.now(),
      ...currentMeasurement,
      weight: parseFloat(currentMeasurement.weight) || 0,
      height: parseFloat(currentMeasurement.height) || 0,
      age: parseInt(currentMeasurement.age) || 0,
      chest: parseFloat(currentMeasurement.chest) || 0,
      waist: parseFloat(currentMeasurement.waist) || 0,
      hips: parseFloat(currentMeasurement.hips) || 0,
      arms: parseFloat(currentMeasurement.arms) || 0,
      thighs: parseFloat(currentMeasurement.thighs) || 0,
      neck: parseFloat(currentMeasurement.neck) || 0,
      bmi: calculateBMI(parseFloat(currentMeasurement.weight) || 0, parseFloat(currentMeasurement.height) || 0),
      bmr: calculateBMR(parseFloat(currentMeasurement.weight) || 0, parseFloat(currentMeasurement.height) || 0, parseInt(currentMeasurement.age) || 0, currentMeasurement.gender),
      tdee: calculateTDEE(parseFloat(currentMeasurement.weight) || 0, parseFloat(currentMeasurement.height) || 0, parseInt(currentMeasurement.age) || 0, currentMeasurement.gender, currentMeasurement.activityLevel),
      bodyFat: calculateBodyFat(parseFloat(currentMeasurement.weight) || 0, parseFloat(currentMeasurement.waist) || 0, parseFloat(currentMeasurement.neck) || 0, parseFloat(currentMeasurement.height) || 0, currentMeasurement.gender, parseInt(currentMeasurement.age) || 0)
    };

    const updatedMeasurements = [...measurements, newMeasurement];
    setMeasurements(updatedMeasurements);
    updateUserMeasurements(updatedMeasurements);
    setShowForm(false);
    setCurrentMeasurement({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      height: '',
      age: '',
      gender: 'male',
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      thighs: '',
      neck: '',
      activityLevel: 'moderate',
      notes: ''
    });
  };

  const updateUserMeasurements = (updatedMeasurements) => {
    console.log('Updated measurements:', updatedMeasurements);
  };

  const deleteMeasurement = (id) => {
    const updatedMeasurements = measurements.filter(m => m.id !== id);
    setMeasurements(updatedMeasurements);
    updateUserMeasurements(updatedMeasurements);
  };

  // BMI Calculator
  const calculateBMI = (weight, height) => {
    if (!weight || !height) return null;
    const bmi = weight / ((height / 100) ** 2);
    return bmi.toFixed(1);
  };

  // BMR Calculator (Basal Metabolic Rate)
  const calculateBMR = (weight, height, age, gender) => {
    if (!weight || !height || !age) return null;
    
    if (gender === 'male') {
      return Math.round(88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age));
    } else {
      return Math.round(447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age));
    }
  };

  // TDEE Calculator (Total Daily Energy Expenditure)
  const calculateTDEE = (weight, height, age, gender, activityLevel) => {
    const bmr = calculateBMR(weight, height, age, gender);
    if (!bmr) return null;

    const activityMultipliers = {
      sedentary: 1.2,      // Little to no exercise
      light: 1.375,        // Light exercise 1-3 days/week
      moderate: 1.55,      // Moderate exercise 3-5 days/week
      active: 1.725,       // Hard exercise 6-7 days/week
      veryActive: 1.9      // Very hard exercise & physical job
    };

    return Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));
  };

  // Body Fat Percentage Calculator (US Navy Method)
  const calculateBodyFat = (weight, waist, neck, height, gender, age) => {
    if (!weight || !waist || !neck || !height || !age) return null;

    if (gender === 'male') {
      // Male body fat formula
      const bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
      return Math.max(0, bodyFat.toFixed(1));
    } else {
      // Female body fat formula (requires hips measurement)
      const hips = currentMeasurement.hips || waist; // Fallback to waist if hips not provided
      const bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.22100 * Math.log10(height)) - 450;
      return Math.max(0, bodyFat.toFixed(1));
    }
  };

  // Get BMI Category
  const getBMICategory = (bmi) => {
    if (!bmi) return '';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  // Get Body Fat Category
  const getBodyFatCategory = (bodyFat, gender) => {
    if (!bodyFat) return '';
    
    if (gender === 'male') {
      if (bodyFat < 6) return 'Essential fat';
      if (bodyFat < 14) return 'Athletic';
      if (bodyFat < 18) return 'Fitness';
      if (bodyFat < 25) return 'Average';
      return 'Obese';
    } else {
      if (bodyFat < 14) return 'Essential fat';
      if (bodyFat < 21) return 'Athletic';
      if (bodyFat < 25) return 'Fitness';
      if (bodyFat < 32) return 'Average';
      return 'Obese';
    }
  };

  // Get latest measurement
  const getLatestMeasurement = () => {
    return measurements.length > 0 ? measurements[measurements.length - 1] : null;
  };

  const latest = getLatestMeasurement();

  return (
    <div className="progress-section">
      <div className="section-header">
        <h2>📏 Body Measurements & Analytics</h2>
        <p>Track your body composition and get detailed health insights</p>
      </div>

      {/* Current Stats with Health Metrics */}
      {latest && (
        <div className="current-stats">
          <h3>Current Health Metrics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Weight</span>
              <span className="stat-value">{latest.weight} kg</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Height</span>
              <span className="stat-value">{latest.height} cm</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">BMI</span>
              <span className="stat-value">
                {latest.bmi} 
                <span className="bmi-category">({getBMICategory(latest.bmi)})</span>
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Body Fat</span>
              <span className="stat-value">
                {latest.bodyFat}%
                <span className="bodyfat-category">({getBodyFatCategory(latest.bodyFat, latest.gender)})</span>
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">BMR</span>
              <span className="stat-value">{latest.bmr} cal</span>
              <span className="stat-description">Resting calories/day</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">TDEE</span>
              <span className="stat-value">{latest.tdee} cal</span>
              <span className="stat-description">Daily calorie need</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Waist</span>
              <span className="stat-value">{latest.waist} cm</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Chest</span>
              <span className="stat-value">{latest.chest} cm</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Calculators */}
      <div className="calculators-section">
        <h3>⚡ Quick Calculators</h3>
        <div className="calculators-grid">
          <div className="calculator-card">
            <h4>BMI Calculator</h4>
            <div className="calculator-form">
              <input
                type="number"
                placeholder="Weight (kg)"
                value={currentMeasurement.weight}
                onChange={(e) => setCurrentMeasurement({...currentMeasurement, weight: e.target.value})}
              />
              <input
                type="number"
                placeholder="Height (cm)"
                value={currentMeasurement.height}
                onChange={(e) => setCurrentMeasurement({...currentMeasurement, height: e.target.value})}
              />
              <div className="calculator-result">
                {currentMeasurement.weight && currentMeasurement.height && (
                  <>
                    <strong>BMI: {calculateBMI(parseFloat(currentMeasurement.weight), parseFloat(currentMeasurement.height))}</strong>
                    <span>{getBMICategory(calculateBMI(parseFloat(currentMeasurement.weight), parseFloat(currentMeasurement.height)))}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="calculator-card">
            <h4>Calorie Calculator</h4>
            <div className="calculator-form">
              <input
                type="number"
                placeholder="Weight (kg)"
                value={currentMeasurement.weight}
                onChange={(e) => setCurrentMeasurement({...currentMeasurement, weight: e.target.value})}
              />
              <input
                type="number"
                placeholder="Height (cm)"
                value={currentMeasurement.height}
                onChange={(e) => setCurrentMeasurement({...currentMeasurement, height: e.target.value})}
              />
              <input
                type="number"
                placeholder="Age"
                value={currentMeasurement.age}
                onChange={(e) => setCurrentMeasurement({...currentMeasurement, age: e.target.value})}
              />
              <select
                value={currentMeasurement.gender}
                onChange={(e) => setCurrentMeasurement({...currentMeasurement, gender: e.target.value})}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <select
                value={currentMeasurement.activityLevel}
                onChange={(e) => setCurrentMeasurement({...currentMeasurement, activityLevel: e.target.value})}
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Light Activity</option>
                <option value="moderate">Moderate Activity</option>
                <option value="active">Active</option>
                <option value="veryActive">Very Active</option>
              </select>
              <div className="calculator-result">
                {currentMeasurement.weight && currentMeasurement.height && currentMeasurement.age && (
                  <>
                    <strong>BMR: {calculateBMR(parseFloat(currentMeasurement.weight), parseFloat(currentMeasurement.height), parseInt(currentMeasurement.age), currentMeasurement.gender)} cal</strong>
                    <strong>TDEE: {calculateTDEE(parseFloat(currentMeasurement.weight), parseFloat(currentMeasurement.height), parseInt(currentMeasurement.age), currentMeasurement.gender, currentMeasurement.activityLevel)} cal</strong>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="calculator-card">
            <h4>Body Fat Calculator</h4>
            <div className="calculator-form">
              <input
                type="number"
                placeholder="Waist (cm)"
                value={currentMeasurement.waist}
                onChange={(e) => setCurrentMeasurement({...currentMeasurement, waist: e.target.value})}
              />
              <input
                type="number"
                placeholder="Neck (cm)"
                value={currentMeasurement.neck}
                onChange={(e) => setCurrentMeasurement({...currentMeasurement, neck: e.target.value})}
              />
              {currentMeasurement.gender === 'female' && (
                <input
                  type="number"
                  placeholder="Hips (cm)"
                  value={currentMeasurement.hips}
                  onChange={(e) => setCurrentMeasurement({...currentMeasurement, hips: e.target.value})}
                />
              )}
              <div className="calculator-result">
                {currentMeasurement.waist && currentMeasurement.neck && currentMeasurement.height && currentMeasurement.age && (
                  <>
                    <strong>Body Fat: {calculateBodyFat(parseFloat(currentMeasurement.weight) || 70, parseFloat(currentMeasurement.waist), parseFloat(currentMeasurement.neck), parseFloat(currentMeasurement.height), currentMeasurement.gender, parseInt(currentMeasurement.age))}%</strong>
                    <span>{getBodyFatCategory(calculateBodyFat(parseFloat(currentMeasurement.weight) || 70, parseFloat(currentMeasurement.waist), parseFloat(currentMeasurement.neck), parseFloat(currentMeasurement.height), currentMeasurement.gender, parseInt(currentMeasurement.age)), currentMeasurement.gender)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Measurement Button */}
      <div className="add-section">
        <button
          onClick={() => setShowForm(!showForm)}
          className="add-measurement-btn"
        >
          {showForm ? '❌ Cancel' : '➕ Add Comprehensive Measurement'}
        </button>
      </div>

      {/* Measurement Form */}
      {showForm && (
        <form onSubmit={addMeasurement} className="measurement-form">
          <h3>New Comprehensive Body Measurement</h3>
          
          <div className="form-section">
            <h4>Basic Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={currentMeasurement.date}
                  onChange={(e) => setCurrentMeasurement({...currentMeasurement, date: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentMeasurement.weight}
                  onChange={(e) => setCurrentMeasurement({...currentMeasurement, weight: e.target.value})}
                  placeholder="e.g., 75.5"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Height (cm)</label>
                <input
                  type="number"
                  value={currentMeasurement.height}
                  onChange={(e) => setCurrentMeasurement({...currentMeasurement, height: e.target.value})}
                  placeholder="e.g., 180"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  value={currentMeasurement.age}
                  onChange={(e) => setCurrentMeasurement({...currentMeasurement, age: e.target.value})}
                  placeholder="e.g., 25"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Gender</label>
                <select
                  value={currentMeasurement.gender}
                  onChange={(e) => setCurrentMeasurement({...currentMeasurement, gender: e.target.value})}
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Activity Level</label>
                <select
                  value={currentMeasurement.activityLevel}
                  onChange={(e) => setCurrentMeasurement({...currentMeasurement, activityLevel: e.target.value})}
                  required
                >
                  <option value="sedentary">Sedentary (little exercise)</option>
                  <option value="light">Light (1-3 days/week)</option>
                  <option value="moderate">Moderate (3-5 days/week)</option>
                  <option value="active">Active (6-7 days/week)</option>
                  <option value="veryActive">Very Active (athlete)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Body Measurements (cm)</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Waist</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentMeasurement.waist}
                  onChange={(e) => setCurrentMeasurement({...currentMeasurement, waist: e.target.value})}
                  placeholder="Waist circumference"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Neck</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentMeasurement.neck}
                  onChange={(e) => setCurrentMeasurement({...currentMeasurement, neck: e.target.value})}
                  placeholder="Neck circumference"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Chest</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentMeasurement.chest}
                  onChange={(e) => setCurrentMeasurement({...currentMeasurement, chest: e.target.value})}
                  placeholder="Chest"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Hips</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentMeasurement.hips}
                  onChange={(e) => setCurrentMeasurement({...currentMeasurement, hips: e.target.value})}
                  placeholder="Hips"
                />
              </div>
              
              <div className="form-group">
                <label>Arms</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentMeasurement.arms}
                  onChange={(e) => setCurrentMeasurement({...currentMeasurement, arms: e.target.value})}
                  placeholder="Arms"
                />
              </div>
              
              <div className="form-group">
                <label>Thighs</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentMeasurement.thighs}
                  onChange={(e) => setCurrentMeasurement({...currentMeasurement, thighs: e.target.value})}
                  placeholder="Thighs"
                />
              </div>
            </div>
          </div>

          {/* Preview Calculations */}
          {(currentMeasurement.weight && currentMeasurement.height && currentMeasurement.age) && (
  <div className="calculation-preview">
    <h4>📊 Preview Calculations</h4>
    <div className="preview-grid">
      <div className="preview-item">
        <span>BMI:</span>
        <strong>{calculateBMI(parseFloat(currentMeasurement.weight), parseFloat(currentMeasurement.height))}, ({getBMICategory(calculateBMI(parseFloat(currentMeasurement.weight), parseFloat(currentMeasurement.height)))})</strong>
      </div>
      <div className="preview-item">
        <span>BMR:</span>
        <strong>{calculateBMR(parseFloat(currentMeasurement.weight), parseFloat(currentMeasurement.height), parseInt(currentMeasurement.age), currentMeasurement.gender)} calories/day</strong>
      </div>
      <div className="preview-item">
        <span>TDEE:</span>
        <strong>{calculateTDEE(parseFloat(currentMeasurement.weight), parseFloat(currentMeasurement.height), parseInt(currentMeasurement.age), currentMeasurement.gender, currentMeasurement.activityLevel)} calories/day</strong>
      </div>
      {(currentMeasurement.waist && currentMeasurement.neck) && (
        <div className="preview-item">
          <span>Body Fat:</span>
          <strong>{calculateBodyFat(parseFloat(currentMeasurement.weight), parseFloat(currentMeasurement.waist), parseFloat(currentMeasurement.neck), parseFloat(currentMeasurement.height), currentMeasurement.gender, parseInt(currentMeasurement.age))}% ({getBodyFatCategory(calculateBodyFat(parseFloat(currentMeasurement.weight), parseFloat(currentMeasurement.waist), parseFloat(currentMeasurement.neck), parseFloat(currentMeasurement.height), currentMeasurement.gender, parseInt(currentMeasurement.age)), currentMeasurement.gender)})</strong>
        </div>
      )}
    </div>
  </div>
)}

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={currentMeasurement.notes}
              onChange={(e) => setCurrentMeasurement({...currentMeasurement, notes: e.target.value})}
              placeholder="Any additional notes about your measurement session..."
              rows="3"
            />
          </div>

          <button type="submit" className="save-btn">
            💾 Save Comprehensive Measurement
          </button>
        </form>
      )}

      {/* Measurements History */}
      <div className="measurements-history">
        <h3>Measurement History</h3>
        {measurements.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📏</div>
            <h3>No Measurements Yet</h3>
            <p>Start tracking your body measurements to see your progress and get health insights!</p>
          </div>
        ) : (
          <div className="measurements-list">
            {measurements.slice().reverse().map(measurement => (
              <div key={measurement.id} className="measurement-card">
                <div className="measurement-header">
                  <h4>{measurement.date}</h4>
                  <button
                    onClick={() => deleteMeasurement(measurement.id)}
                    className="delete-btn"
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="measurement-details">
                  <div className="measurement-row">
                    <span>Weight:</span>
                    <strong>{measurement.weight} kg</strong>
                  </div>
                  <div className="measurement-row">
                    <span>BMI:</span>
                    <strong>{measurement.bmi} ({getBMICategory(measurement.bmi)})</strong>
                  </div>
                  <div className="measurement-row">
                    <span>Body Fat:</span>
                    <strong>{measurement.bodyFat}% ({getBodyFatCategory(measurement.bodyFat, measurement.gender)})</strong>
                  </div>
                  <div className="measurement-row">
                    <span>TDEE:</span>
                    <strong>{measurement.tdee} cal/day</strong>
                  </div>
                  {measurement.waist && (
                    <div className="measurement-row">
                      <span>Waist:</span>
                      <strong>{measurement.waist} cm</strong>
                    </div>
                  )}
                  {measurement.notes && (
                    <div className="measurement-notes">
                      <p>{measurement.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyMeasurements;