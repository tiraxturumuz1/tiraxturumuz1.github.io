import React from 'react';

interface Task {
  id: number;
  title: string;
  reward: string;
}

const tasks: Task[] = [
  { id: 1, title: "Watch Video Ad", reward: "0.01 Pi" },
  { id: 2, title: "Join Community Poll", reward: "0.05 Pi" },
  { id: 3, title: "Daily Check-in", reward: "0.005 Pi" },
];

const EngagementTasksPage: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Daily Engagement Tasks</h2>
      <p>Complete these tasks to earn Pi rewards.</p>
      
      <div style={{ marginTop: '20px' }}>
        {tasks.map(task => (
          <div key={task.id} style={taskCardStyle}>
            <div>
              <strong>{task.title}</strong>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Reward: {task.reward}</div>
            </div>
            <button style={actionButtonStyle}>Claim</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const taskCardStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px',
  border: '1px solid #ddd',
  borderRadius: '10px',
  marginBottom: '10px',
  backgroundColor: '#f9f9f9'
};

const actionButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#4caf50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default EngagementTasksPage;
