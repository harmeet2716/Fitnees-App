import React, { useState, useRef } from 'react';
import './Profile.css';

const UserProfile = ({ user, onUpdateProfile, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    weight: user?.weight || '',
    height: user?.height || '',
    gender: user?.gender || 'prefer-not-to-say',
    fitnessLevel: user?.fitnessLevel || 'beginner',
    profilePicture: user?.profilePicture || ''
  });

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    onUpdateProfile(profileData);
    setIsEditing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({
          ...profileData,
          profilePicture: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>👤 My Profile</h2>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="profile-card">
        {/* Profile Picture Section */}
        <div className="profile-picture-section">
          <div className="profile-image-container">
            <img 
              src={profileData.profilePicture || '/default-avatar.png'} 
              alt="Profile" 
              className="profile-image"
            />
            {isEditing && (
              <button 
                onClick={triggerFileInput}
                className="change-photo-btn"
              >
                📷
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
          <h3 className="profile-name">{profileData.name}</h3>
          <span className={`fitness-level-badge ${profileData.fitnessLevel}`}>
            {profileData.fitnessLevel}
          </span>
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          {!isEditing ? (
            // View Mode
            <>
              <div className="detail-row">
                <span className="detail-label">Age:</span>
                <span className="detail-value">{profileData.age || 'Not set'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Weight:</span>
                <span className="detail-value">
                  {profileData.weight ? `${profileData.weight} kg` : 'Not set'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Height:</span>
                <span className="detail-value">
                  {profileData.height ? `${profileData.height} cm` : 'Not set'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Gender:</span>
                <span className="detail-value">
                  {profileData.gender === 'prefer-not-to-say' ? 'Not specified' : profileData.gender}
                </span>
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="edit-button"
              >
                ✏️ Edit Profile
              </button>
            </>
          ) : (
            // Edit Mode
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={profileData.age}
                    onChange={handleChange}
                    placeholder="Age"
                    min="10"
                    max="100"
                  />
                </div>

                <div className="form-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={profileData.weight}
                    onChange={handleChange}
                    placeholder="Weight"
                    min="30"
                    max="200"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={profileData.height}
                    onChange={handleChange}
                    placeholder="Height"
                    min="100"
                    max="250"
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select 
                    name="gender" 
                    value={profileData.gender} 
                    onChange={handleChange}
                  >
                    <option value="prefer-not-to-say">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Fitness Level</label>
                <select 
                  name="fitnessLevel" 
                  value={profileData.fitnessLevel} 
                  onChange={handleChange}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="athlete">Athlete</option>
                </select>
              </div>

              <div className="profile-actions">
                <button onClick={handleSave} className="save-button">
                  💾 Save Changes
                </button>
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="cancel-button"
                >
                  ❌ Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;