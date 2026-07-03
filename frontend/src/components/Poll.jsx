import React, { useState } from 'react';
import './Poll.css';

const Poll = () => {
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState({ yes: 45, no: 55 });

  const handleVote = (option) => {
    if (!voted) {
      setVotes({
        yes: option === 'yes' ? votes.yes + 1 : votes.yes,
        no: option === 'no' ? votes.no + 1 : votes.no
      });
      setVoted(true);
    }
  };

  const totalVotes = votes.yes + votes.no;
  const yesPercent = ((votes.yes / totalVotes) * 100).toFixed(0);
  const noPercent = ((votes.no / totalVotes) * 100).toFixed(0);

  return (
    <section id="poll" className="poll-section">
      <div className="poll-container">
        <h2 className="poll-question">Would you like to decentralize important parts of global decision-making?</h2>
        
        {!voted ? (
          <div className="poll-options">
            <button className="poll-btn" onClick={() => handleVote('yes')}>Yes, definitely</button>
            <button className="poll-btn" onClick={() => handleVote('no')}>No, keep it centralized</button>
          </div>
        ) : (
          <div className="poll-results">
            <div style={{textAlign: 'left', marginBottom: '5px'}}>Yes: {yesPercent}%</div>
            <div className="result-bar-container">
              <div className="result-bar" style={{width: `${yesPercent}%`}}></div>
            </div>
            
            <div style={{textAlign: 'left', marginTop: '20px', marginBottom: '5px'}}>No: {noPercent}%</div>
            <div className="result-bar-container">
              <div className="result-bar" style={{width: `${noPercent}%`, backgroundColor: '#94a3b8'}}></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Poll;
