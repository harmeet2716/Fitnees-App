import React, { useState, useRef, useEffect } from 'react';
import './ProgressPhotosPage.css';

const ProgressPhotosPage = ({ user }) => {
  const [photos, setPhotos] = useState(user?.progressPhotos || []);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCategory, setSelectedCategory] = useState('front');
  const [notes, setNotes] = useState('');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid, timeline, comparison
  const fileInputRef = useRef(null);

  // Filter photos by category
  const filteredPhotos = photos.filter(photo => 
    selectedCategory === 'all' || photo.category === selectedCategory
  );

  // Group photos by month for timeline view
  const photosByMonth = filteredPhotos.reduce((acc, photo) => {
    const monthYear = photo.date.substring(0, 7); // YYYY-MM
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(photo);
    return acc;
  }, {});

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto = {
          id: Date.now(),
          url: e.target.result,
          date: selectedDate,
          category: selectedCategory,
          notes: notes,
          timestamp: new Date().toISOString()
        };
        const updatedPhotos = [newPhoto, ...photos];
        setPhotos(updatedPhotos);
        updateUserPhotos(updatedPhotos);
        setNotes('');
        // Reset form
        setSelectedCategory('front');
      };
      reader.readAsDataURL(file);
    }
  };

  const updateUserPhotos = (updatedPhotos) => {
    // Update user context or make API call
    console.log('Updated photos:', updatedPhotos);
    // This would typically update the user context
    if (user) {
      const users = JSON.parse(localStorage.getItem('fitnessUsers') || '[]');
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, progressPhotos: updatedPhotos } : u
      );
      localStorage.setItem('fitnessUsers', JSON.stringify(updatedUsers));
      
      const updatedUser = { ...user, progressPhotos: updatedPhotos };
      localStorage.setItem('currentFitnessUser', JSON.stringify(updatedUser));
    }
  };

  const deletePhoto = (id) => {
    const updatedPhotos = photos.filter(photo => photo.id !== id);
    setPhotos(updatedPhotos);
    updateUserPhotos(updatedPhotos);
    
    // Remove from selected photos if it was selected
    setSelectedPhotos(selectedPhotos.filter(photoId => photoId !== id));
  };

  const updatePhotoNotes = (id, newNotes) => {
    const updatedPhotos = photos.map(photo =>
      photo.id === id ? { ...photo, notes: newNotes } : photo
    );
    setPhotos(updatedPhotos);
    updateUserPhotos(updatedPhotos);
  };

  const togglePhotoSelection = (id) => {
    if (selectedPhotos.includes(id)) {
      setSelectedPhotos(selectedPhotos.filter(photoId => photoId !== id));
    } else {
      setSelectedPhotos([...selectedPhotos, id]);
    }
  };

  const startComparison = () => {
    if (selectedPhotos.length === 2) {
      setComparisonMode(true);
      setViewMode('comparison');
    } else {
      alert('Please select exactly 2 photos to compare');
    }
  };

  const getPhotoByDate = (date) => {
    return photos.find(photo => photo.date === date);
  };

  const getProgressStats = () => {
    if (photos.length < 2) return null;

    const sortedPhotos = [...photos].sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstPhoto = sortedPhotos[0];
    const latestPhoto = sortedPhotos[sortedPhotos.length - 1];
    const daysBetween = Math.floor((new Date(latestPhoto.date) - new Date(firstPhoto.date)) / (1000 * 60 * 60 * 24));

    return {
      totalPhotos: photos.length,
      timeSpan: daysBetween,
      firstDate: firstPhoto.date,
      latestDate: latestPhoto.date,
      categories: [...new Set(photos.map(photo => photo.category))]
    };
  };

  const stats = getProgressStats();

  return (
    <div className="progress-photos-page">
      {/* Header */}
      <div className="photos-header">
        <h1>📸 Progress Photos</h1>
        <p>Track your visual transformation and celebrate your journey</p>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="photos-stats">
          <div className="stat-card">
            <div className="stat-icon">🖼️</div>
            <div className="stat-content">
              <h3>{stats.totalPhotos}</h3>
              <p>Total Photos</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>{stats.timeSpan}</h3>
              <p>Days Tracked</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats.categories.length}</h3>
              <p>View Types</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="upload-section">
        <div className="upload-card">
          <div className="upload-header">
            <h2>➕ Add New Photo</h2>
            <p>Capture your progress with a new photo</p>
          </div>
          
          <div className="upload-form">
            <div className="form-row">
              <div className="form-group">
                <label>📅 Photo Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="form-group">
                <label>👁️ View Type</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="front">Front View</option>
                  <option value="side">Side View</option>
                  <option value="back">Back View</option>
                  <option value="flexed">Flexed</option>
                  <option value="relaxed">Relaxed</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>📝 Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How are you feeling? Any special conditions?"
                rows="3"
              />
            </div>

            <div className="upload-actions">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="upload-btn primary"
              >
                📁 Choose Photo
              </button>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* View Controls */}
      <div className="view-controls">
        <div className="view-buttons">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            🏞️ Grid View
          </button>
          <button 
            className={`view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
            onClick={() => setViewMode('timeline')}
          >
            📅 Timeline
          </button>
          <button 
            className={`view-btn ${viewMode === 'comparison' ? 'active' : ''}`}
            onClick={() => {
              if (selectedPhotos.length === 2) {
                setViewMode('comparison');
              } else {
                alert('Select 2 photos to compare');
              }
            }}
          >
            🔄 Compare
          </button>
        </div>

        <div className="filter-controls">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="all">All Views</option>
            <option value="front">Front View</option>
            <option value="side">Side View</option>
            <option value="back">Back View</option>
            <option value="flexed">Flexed</option>
            <option value="relaxed">Relaxed</option>
          </select>
        </div>
      </div>

      {/* Selection Controls */}
      {viewMode !== 'comparison' && (
        <div className="selection-controls">
          <div className="selection-info">
            <span>{selectedPhotos.length} photos selected</span>
          </div>
          <div className="selection-actions">
            <button
              onClick={startComparison}
              disabled={selectedPhotos.length !== 2}
              className="compare-btn"
            >
              🔄 Compare Selected
            </button>
            <button
              onClick={() => setSelectedPhotos([])}
              className="clear-selection-btn"
            >
              ❌ Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Photos Content */}
      <div className="photos-content">
        {viewMode === 'grid' && (
          <div className="photos-grid">
            {filteredPhotos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📸</div>
                <h3>No Progress Photos Yet</h3>
                <p>Start by uploading your first progress photo to track your visual journey!</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="upload-cta-btn"
                >
                  📸 Upload Your First Photo
                </button>
              </div>
            ) : (
              filteredPhotos.map(photo => (
                <div 
                  key={photo.id} 
                  className={`photo-card ${selectedPhotos.includes(photo.id) ? 'selected' : ''}`}
                  onClick={() => togglePhotoSelection(photo.id)}
                >
                  <div className="photo-container">
                    <img src={photo.url} alt="Progress" className="progress-photo" />
                    <div className="photo-overlay">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePhoto(photo.id);
                        }}
                        className="delete-btn"
                      >
                        🗑️
                      </button>
                      <span className="view-type">{photo.category}</span>
                    </div>
                    {selectedPhotos.includes(photo.id) && (
                      <div className="selection-indicator">✅</div>
                    )}
                  </div>
                  
                  <div className="photo-details">
                    <div className="photo-date">{photo.date}</div>
                    <textarea
                      value={photo.notes}
                      onChange={(e) => updatePhotoNotes(photo.id, e.target.value)}
                      placeholder="Add notes..."
                      className="photo-notes"
                      rows="2"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {viewMode === 'timeline' && (
          <div className="timeline-view">
            {Object.entries(photosByMonth).map(([monthYear, monthPhotos]) => (
              <div key={monthYear} className="timeline-month">
                <h3 className="timeline-header">
                  {new Date(monthYear + '-01').toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </h3>
                <div className="timeline-photos">
                  {monthPhotos.map(photo => (
                    <div key={photo.id} className="timeline-photo">
                      <img src={photo.url} alt="Progress" />
                      <div className="timeline-info">
                        <span className="photo-date">{photo.date}</span>
                        <span className="view-type">{photo.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'comparison' && selectedPhotos.length === 2 && (
          <div className="comparison-view">
            <div className="comparison-header">
              <h3>🔄 Progress Comparison</h3>
              <button
                onClick={() => {
                  setViewMode('grid');
                  setSelectedPhotos([]);
                }}
                className="back-btn"
              >
                ← Back to Grid
              </button>
            </div>
            
            <div className="comparison-container">
              {selectedPhotos.map(photoId => {
                const photo = photos.find(p => p.id === photoId);
                return (
                  <div key={photo.id} className="comparison-item">
                    <div className="comparison-photo">
                      <img src={photo.url} alt="Comparison" />
                    </div>
                    <div className="comparison-details">
                      <h4>{photo.date}</h4>
                      <span className="view-type">{photo.category} View</span>
                      {photo.notes && (
                        <p className="photo-notes">{photo.notes}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="comparison-notes">
              <h4>📝 Comparison Notes</h4>
              <p>
                Compare your progress side by side. Look for changes in muscle definition, 
                posture, and overall composition. Celebrate your improvements!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="tips-section">
        <h3>💡 Progress Photo Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">⚡</span>
            <h4>Consistent Lighting</h4>
            <p>Take photos in the same lighting conditions for accurate comparisons</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🎯</span>
            <h4>Same Pose</h4>
            <p>Use consistent poses and angles to track real progress</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">📅</span>
            <h4>Regular Intervals</h4>
            <p>Take photos every 2-4 weeks to see meaningful changes</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">👕</span>
            <h4>Similar Clothing</h4>
            <p>Wear similar clothing to better visualize body composition changes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPhotosPage;