import React, { useState } from 'react';
import './App.css';
import { Camera } from '@capacitor/camera';
import Camera_Function from './Camera_Function';

function App() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('bmi'); // 'bmi' or 'camera'

  const calculateBMI = () => {
    const heightInMeters = parseInt(height) / 100;
    const weightInKg = parseInt(weight);
    
    if (isNaN(heightInMeters) || isNaN(weightInKg) || 
        height <= 0 || height > 300 || 
        weight <= 0 || weight > 500) {
      alert('Vui lòng nhập chiều cao (0-300cm) và cân nặng (0-700kg) hợp lệ!');
      return;
    }
    
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    const bmiRounded = Math.round(bmi * 10) / 10;
    
    let assessment = '';
    if (bmi < 18.5) assessment = 'Gầy';
    else if (bmi < 24.9) assessment = 'Bình thường';
    else if (bmi < 29.9) assessment = 'Thừa cân';
    else assessment = 'Béo phì';
    
    setBmiResult({ bmi: bmiRounded, assessment });
    
    // Show local notification
    setNotification(`Chỉ số BMI của bạn là ${bmiRounded} - ${assessment}`);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const shareResult = async () => {
    if (!bmiResult) {
      alert('Vui lòng tính BMI trước khi chia sẻ!');
      return;
    }

    const shareText = `Chỉ số BMI của tôi là ${bmiResult.bmi} - ${bmiResult.assessment}`;
    
    try {
      // For web browsers, directly copy to clipboard
      await navigator.clipboard.writeText(shareText);
      alert('Đã sao chép kết quả: ' + shareText);
    } catch (error) {
      console.error('Lỗi khi chia sẻ:', error);
      alert('Không thể chia sẻ kết quả.');
    }
  };

  return (
    <div className="app-container">
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
      
      <header className="app-header">
        <h1>Tính BMI</h1>
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'bmi' ? 'active' : ''}`}
            onClick={() => setActiveTab('bmi')}
          >
            <i className="fas fa-calculator"></i> Tính BMI
          </button>
          <button 
            className={`tab-button ${activeTab === 'camera' ? 'active' : ''}`}
            onClick={() => setActiveTab('camera')}
          >
            <i className="fas fa-camera"></i> Camera
          </button>
        </div>
      </header>
      
      <main className="app-content">
        {activeTab === 'bmi' ? (
          <div className="bmi-calculator-container">
            <h2>Tính chỉ số BMI</h2>
            <div className="input-group">
              <label htmlFor="height">Chiều cao (cm):</label>
              <input 
                id="height"
                type="number" 
                placeholder="Nhập chiều cao của bạn"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="weight">Cân nặng (kg):</label>
              <input 
                id="weight"
                type="number" 
                placeholder="Nhập cân nặng của bạn"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <button className="calculate-button" onClick={calculateBMI}>
              Tính BMI
            </button>
            
            {bmiResult && (
              <div className="result-card">
                <div className="result-header">Kết quả</div>
                <div className="result-content">
                  <p>Chỉ số BMI: <span className="bmi-value">{bmiResult.bmi}</span></p>
                  <p>Đánh giá: <span className="assessment-value">{bmiResult.assessment}</span></p>
                </div>
                <button className="share-button" onClick={shareResult}>
                  <i className="fas fa-share-alt"></i> Chia sẻ kết quả
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="camera-container">
            <h2>Chức năng Camera</h2>
            <Camera_Function />
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>© PHAM QUANG TUAN</p>
      </footer>
    </div>
  );
}

export default App;