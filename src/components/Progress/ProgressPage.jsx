import React, { useState } from 'react';
import ProgressPhotos from './ProgressPhotosPage';
import BodyMeasurements from './BodyMeasurements';
import Analytics from './Analytics';
import PersonalRecords from './PersonalRecords';
import './Progress.css';

const ProgressPage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('photos');

  const tabs = [
    { id: 'photos', label: '📸 Progress Photos', icon: '📸' },
    { id: 'measurements', label: '📏 Body Measurements', icon: '📏' },
    { id: 'analytics', label: '📊 Analytics', icon: '📊' },
    { id: 'records', label: '🎯 Personal Records', icon: '🎯' }
  ];

  return (
    <div className="progress-page">
      <div className="progress-header">
        <h1>📈 Your Fitness Journey</h1>
        <p>Track your progress and celebrate your achievements</p>
      </div>

      {/* Progress Stats Overview */}
      <div className="progress-overview">
        <div className="overview-card">
          <div className="overview-icon">📸</div>
          <div className="overview-content">
            <h3>{user?.progressPhotos?.length || 0}</h3>
            <p>Progress Photos</p>
          </div>
        </div>
        
        <div className="overview-card">
          <div className="overview-icon">📏</div>
          <div className="overview-content">
            <h3>{user?.bodyMeasurements?.length || 0}</h3>
            <p>Measurements</p>
          </div>
        </div>
        
        <div className="overview-card">
          <div className="overview-icon">🎯</div>
          <div className="overview-content">
            <h3>{user?.personalRecords?.length || 0}</h3>
            <p>Personal Records</p>
          </div>
        </div>
        
        <div className="overview-card">
          <div className="overview-icon">📊</div>
          <div className="overview-content">
            <h3>{user?.workouts?.length || 0}</h3>
            <p>Total Workouts</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="progress-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'photos' && <ProgressPhotos user={user} />}
        {activeTab === 'measurements' && <BodyMeasurements user={user} />}
        {activeTab === 'analytics' && <Analytics user={user} />}
        {activeTab === 'records' && <PersonalRecords user={user} />}
      </div>
    </div>
  );
};

export default ProgressPage;