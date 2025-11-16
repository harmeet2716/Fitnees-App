import React, { useState, useEffect } from 'react';
import './Analytics.css';

const Analytics = ({ user }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [analyticsData, setAnalyticsData] = useState({});
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const workouts = user?.workouts || [];
    generateAnalytics(workouts);
    generateChartData(workouts);
  }, [user, timeRange]);

  const generateChartData = (workouts) => {
    const now = new Date();
    let daysToShow = 7;
    let dateFormat = 'EEE';

    switch (timeRange) {
      case 'week':
        daysToShow = 7;
        dateFormat = 'EEE';
        break;
      case 'month':
        daysToShow = 30;
        dateFormat = 'MMM dd';
        break;
      case 'year':
        daysToShow = 12;
        dateFormat = 'MMM';
        break;
    }

    const data = [];
    
    if (timeRange === 'year') {
      // Monthly data for year view
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
        const year = date.getFullYear();
        
        const monthWorkouts = workouts.filter(workout => {
          const workoutDate = new Date(workout.date);
          return workoutDate.getMonth() === date.getMonth() && 
                 workoutDate.getFullYear() === date.getFullYear();
        });

        data.push({
          label: monthKey,
          fullLabel: `${monthKey} ${year}`,
          workouts: monthWorkouts.length,
          duration: monthWorkouts.reduce((sum, w) => sum + w.duration, 0),
          calories: monthWorkouts.reduce((sum, w) => sum + w.calories, 0),
          date: date
        });
      }
    } else {
      // Daily data for week/month view
      for (let i = daysToShow - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateKey = date.toLocaleDateString('en-US', { 
          weekday: timeRange === 'week' ? 'short' : undefined,
          month: timeRange === 'month' ? 'short' : undefined,
          day: 'numeric'
        });

        const dayWorkouts = workouts.filter(workout => 
          workout.date === date.toISOString().split('T')[0]
        );

        data.push({
          label: dateKey,
          fullLabel: date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          workouts: dayWorkouts.length,
          duration: dayWorkouts.reduce((sum, w) => sum + w.duration, 0),
          calories: dayWorkouts.reduce((sum, w) => sum + w.calories, 0),
          date: date.toISOString().split('T')[0]
        });
      }
    }

    setChartData(data);
  };

  const generateAnalytics = (workouts) => {
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    const filteredWorkouts = workouts.filter(workout => 
      new Date(workout.date) >= startDate
    );

    const data = {
      totalWorkouts: filteredWorkouts.length,
      totalMinutes: filteredWorkouts.reduce((sum, w) => sum + w.duration, 0),
      totalCalories: filteredWorkouts.reduce((sum, w) => sum + w.calories, 0),
      avgWorkoutDuration: filteredWorkouts.length > 0 ? 
        Math.round(filteredWorkouts.reduce((sum, w) => sum + w.duration, 0) / filteredWorkouts.length) : 0,
      workoutTypes: filteredWorkouts.reduce((acc, workout) => {
        acc[workout.type] = (acc[workout.type] || 0) + 1;
        return acc;
      }, {}),
      weeklyConsistency: calculateConsistency(filteredWorkouts),
      progress: calculateProgress(filteredWorkouts)
    };

    setAnalyticsData(data);
  };

  const calculateConsistency = (workouts) => {
    const daysWithWorkouts = new Set(workouts.map(w => w.date)).size;
    const totalDays = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    return Math.round((daysWithWorkouts / Math.min(totalDays, workouts.length)) * 100);
  };

  const calculateProgress = (workouts) => {
    if (workouts.length < 2) return { trend: 'stable', percentage: 0 };
    
    const recent = workouts.slice(0, Math.floor(workouts.length / 2));
    const older = workouts.slice(Math.floor(workouts.length / 2));
    
    const recentAvg = recent.reduce((sum, w) => sum + w.duration, 0) / recent.length;
    const olderAvg = older.reduce((sum, w) => sum + w.duration, 0) / older.length;
    
    const percentage = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 100;
    
    return {
      trend: percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'stable',
      percentage: Math.abs(percentage)
    };
  };

  const getWorkoutTypeColor = (type) => {
    const colors = {
      cardio: '#FF6B6B',
      strength: '#4ECDC4',
      yoga: '#FFD166',
      sports: '#6A0572',
      hiit: '#FF9E6D',
      flexibility: '#A78BFA'
    };
    return colors[type] || '#94A3B8';
  };

  const getMaxValue = (data, key) => {
    return Math.max(...data.map(item => item[key]), 1);
  };

  const renderBarChart = () => {
    const maxDuration = getMaxValue(chartData, 'duration');
    const maxWorkouts = getMaxValue(chartData, 'workouts');

    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3>📈 Workout Progress</h3>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color duration"></span>
              <span>Duration (min)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color workouts"></span>
              <span>Workouts</span>
            </div>
          </div>
        </div>
        
        <div className="chart-bars">
          {chartData.map((item, index) => (
            <div key={index} className="chart-bar-group">
              <div 
                className="chart-bar duration-bar"
                style={{ 
                  height: `${(item.duration / maxDuration) * 80}%`,
                  backgroundColor: '#667eea'
                }}
                title={`${item.fullLabel}: ${item.duration} minutes`}
              >
                <span className="bar-value">{item.duration}</span>
              </div>
              
              <div 
                className="chart-bar workout-bar"
                style={{ 
                  height: `${(item.workouts / maxWorkouts) * 80}%`,
                  backgroundColor: '#4CAF50'
                }}
                title={`${item.fullLabel}: ${item.workouts} workouts`}
              >
                <span className="bar-value">{item.workouts}</span>
              </div>
              
              <div className="chart-label">{item.label}</div>
            </div>
          ))}
        </div>
        
        <div className="chart-axis">
          <div className="axis-label">Time</div>
          <div className="axis-label">Duration/Workouts</div>
        </div>
      </div>
    );
  };

  const renderLineChart = () => {
    const maxCalories = getMaxValue(chartData, 'calories');
    
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3>🔥 Calories Burned Trend</h3>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color calories"></span>
              <span>Calories Burned</span>
            </div>
          </div>
        </div>
        
        <div className="line-chart">
          <svg viewBox={`0 0 ${chartData.length * 50} 200`} className="line-chart-svg">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((percent, index) => (
              <line
                key={index}
                x1="0"
                y1={200 - (percent * 2)}
                x2={chartData.length * 50}
                y2={200 - (percent * 2)}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            ))}
            
            {/* Data line */}
            <polyline
              fill="none"
              stroke="#FF6B6B"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={chartData.map((item, index) => 
                `${index * 50 + 25},${200 - (item.calories / maxCalories) * 200}`
              ).join(' ')}
            />
            
            {/* Data points */}
            {chartData.map((item, index) => (
              <circle
                key={index}
                cx={index * 50 + 25}
                cy={200 - (item.calories / maxCalories) * 200}
                r="4"
                fill="#FF6B6B"
                stroke="#fff"
                strokeWidth="2"
              />
            ))}
            
            {/* Labels */}
            {chartData.map((item, index) => (
              <text
                key={index}
                x={index * 50 + 25}
                y="220"
                textAnchor="middle"
                fill="rgba(255,255,255,0.7)"
                fontSize="12"
              >
                {item.label}
              </text>
            ))}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="progress-section">
      <div className="section-header">
        <h2>📊 Advanced Analytics</h2>
        <p>Deep insights into your fitness journey and performance</p>
      </div>

      {/* Time Range Filter */}
      <div className="time-filter">
        <button 
          className={`filter-btn ${timeRange === 'week' ? 'active' : ''}`}
          onClick={() => setTimeRange('week')}
        >
          This Week
        </button>
        <button 
          className={`filter-btn ${timeRange === 'month' ? 'active' : ''}`}
          onClick={() => setTimeRange('month')}
        >
          This Month
        </button>
        <button 
          className={`filter-btn ${timeRange === 'year' ? 'active' : ''}`}
          onClick={() => setTimeRange('year')}
        >
          This Year
        </button>
      </div>

      {/* Key Metrics */}
      <div className="analytics-overview">
        <div className="metric-card">
          <div className="metric-icon">💪</div>
          <div className="metric-content">
            <h3>{analyticsData.totalWorkouts || 0}</h3>
            <p>Total Workouts</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">⏱️</div>
          <div className="metric-content">
            <h3>{analyticsData.totalMinutes || 0}</h3>
            <p>Total Minutes</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">🔥</div>
          <div className="metric-content">
            <h3>{analyticsData.totalCalories || 0}</h3>
            <p>Calories Burned</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>{analyticsData.avgWorkoutDuration || 0}m</h3>
            <p>Avg Duration</p>
          </div>
        </div>
      </div>

      {/* Progress Charts */}
      <div className="charts-grid">
        <div className="chart-wrapper">
          {renderBarChart()}
        </div>
        <div className="chart-wrapper">
          {renderLineChart()}
        </div>
      </div>

      {/* Progress Trend */}
      {analyticsData.progress && (
        <div className="progress-trend">
          <h3>Progress Trend</h3>
          <div className={`trend-indicator ${analyticsData.progress.trend}`}>
            <div className="trend-icon">
              {analyticsData.progress.trend === 'up' ? '📈' : 
               analyticsData.progress.trend === 'down' ? '📉' : '➡️'}
            </div>
            <div className="trend-info">
              <h4>
                {analyticsData.progress.trend === 'up' ? 'Improving' : 
                 analyticsData.progress.trend === 'down' ? 'Needs Attention' : 'Stable'}
              </h4>
              <p>
                {analyticsData.progress.trend !== 'stable' && 
                 `${analyticsData.progress.percentage.toFixed(1)}% ${analyticsData.progress.trend === 'up' ? 'increase' : 'decrease'} in workout duration`}
                {analyticsData.progress.trend === 'stable' && 'Consistent performance maintained'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Workout Type Distribution */}
      {analyticsData.workoutTypes && Object.keys(analyticsData.workoutTypes).length > 0 && (
        <div className="workout-distribution">
          <h3>Workout Type Distribution</h3>
          <div className="distribution-chart">
            {Object.entries(analyticsData.workoutTypes).map(([type, count]) => (
              <div key={type} className="distribution-item">
                <div className="distribution-bar">
                  <div 
                    className="bar-fill"
                    style={{
                      width: `${(count / analyticsData.totalWorkouts) * 100}%`,
                      backgroundColor: getWorkoutTypeColor(type)
                    }}
                  ></div>
                </div>
                <div className="distribution-label">
                  <span className="type-name">{type}</span>
                  <span className="type-count">{count} workouts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Consistency Score */}
      <div className="consistency-score">
        <h3>Workout Consistency</h3>
        <div className="consistency-card">
          <div 
            className="consistency-circle"
            style={{ 
              background: `conic-gradient(#4CAF50 0% ${analyticsData.weeklyConsistency || 0}%, rgba(255, 255, 255, 0.2) ${analyticsData.weeklyConsistency || 0}% 100%)` 
            }}
          >
            <span className="consistency-percentage">
              {analyticsData.weeklyConsistency || 0}%
            </span>
          </div>
          <div className="consistency-info">
            <h4>Consistency Score</h4>
            <p>
              {analyticsData.weeklyConsistency >= 80 ? 'Excellent consistency! Keep it up! 🎉' :
               analyticsData.weeklyConsistency >= 60 ? 'Good consistency! Almost there! 💪' :
               analyticsData.weeklyConsistency >= 40 ? 'Keep building your routine! 🔥' :
               'Time to build some momentum! 🚀'}
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="recommendations">
        <h3>💡 Smart Recommendations</h3>
        <div className="recommendation-list">
          {analyticsData.totalWorkouts < 3 && (
            <div className="recommendation-item">
              <span className="rec-icon">🎯</span>
              <div className="rec-content">
                <strong>Build Consistency</strong>
                <p>Try to complete at least 3 workouts this week to build momentum</p>
              </div>
            </div>
          )}
          
          {analyticsData.workoutTypes && !analyticsData.workoutTypes.strength && (
            <div className="recommendation-item">
              <span className="rec-icon">💪</span>
              <div className="rec-content">
                <strong>Add Strength Training</strong>
                <p>Consider adding strength workouts to build muscle and boost metabolism</p>
              </div>
            </div>
          )}
          
          {analyticsData.avgWorkoutDuration < 30 && (
            <div className="recommendation-item">
              <span className="rec-icon">⏱️</span>
              <div className="rec-content">
                <strong>Extend Workout Duration</strong>
                <p>Try to gradually increase your workout duration to 30+ minutes</p>
              </div>
            </div>
          )}
          
          <div className="recommendation-item">
            <span className="rec-icon">🔄</span>
            <div className="rec-content">
              <strong>Mix It Up</strong>
              <p>Variety in workouts prevents plateaus and keeps you motivated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;