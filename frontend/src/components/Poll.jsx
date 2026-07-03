import React, { useState } from 'react';
import './Poll.css';

const Poll = () => {
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  
  // مقادیر اولیه (می‌توانی بعداً از API بگیری)
  const [results, setResults] = useState({
    yes: 65, // درصد رای بله
    no: 35   // درصد رای خیر
  });

  const handleVote = (option) => {
    if (voted) return;

    setSelectedOption(option);
    setVoted(true);

    // شبیه‌سازی تغییر درصدها (در پروژه واقعی اینجا به سمت سرور درخواست می‌فرستادی)
    if (option === 'yes') {
      setResults({ yes: 68, no: 32 });
    } else {
      setResults({ yes: 62, no: 38 });
    }
  };

  return (
    <section className="poll-container">
      <div className="poll-card">
        <h3 className="poll-question">
          Would you like to decentralize important parts of the centralized decision-making of all countries?
        </h3>

        <div className="poll-options">
          {/* گزینه Yes */}
          <button 
            className={`poll-option-btn ${voted ? 'voted' : ''}`} 
            onClick={() => handleVote('yes')}
          >
            <div 
              className="progress-bar" 
              style={{ width: voted ? `${results.yes}%` : '0%' }}
            ></div>
            <div className="option-text">
              <span>1. Yes</span>
              {voted && <span className="percentage">{results.yes}%</span>}
            </div>
          </button>

          {/* گزینه No */}
          <button 
            className={`poll-option-btn ${voted ? 'voted' : ''}`} 
            onClick={() => handleVote('no')}
          >
            <div 
              className="progress-bar" 
              style={{ width: voted ? `${results.no}%` : '0%' }}
            ></div>
            <div className="option-text">
              <span>2. No</span>
              {voted && <span className="percentage">{results.no}%</span>}
            </div>
          </button>
        </div>

        {voted && (
          <p style={{ marginTop: '20px', color: '#6b7280', fontSize: '14px' }}>
            Thank you for your participation!
          </p>
        )}
      </div>
    </section>
  );
};

export default Poll;
