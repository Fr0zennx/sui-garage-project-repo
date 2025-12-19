import { useState } from 'react';
import './ProjectTabs.css';

interface Project {
  id: number;
  title: string;
  description: string;
  icon: string;
  status: 'completed' | 'in-progress' | 'locked';
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Wallet Connection',
    description: 'Successfully connected your Sui Wallet and completed the first step.',
    icon: '①',
    status: 'completed',
    difficulty: 'Easy',
  },
  {
    id: 2,
    title: 'Token Transfer',
    description: 'Send SUI tokens to another address and perform a transfer on the blockchain.',
    icon: '②',
    status: 'in-progress',
    difficulty: 'Easy',
  },
  {
    id: 3,
    title: 'NFT Minting',
    description: 'Create your own NFT and register it on the Sui blockchain.',
    icon: '③',
    status: 'locked',
    difficulty: 'Medium',
  },
  {
    id: 4,
    title: 'Smart Contract Interaction',
    description: 'Call Move smart contract functions and read data.',
    icon: '④',
    status: 'locked',
    difficulty: 'Medium',
  },
  {
    id: 5,
    title: 'Object Creation',
    description: 'Create and manage your own object structure in Sui.',
    icon: '⑤',
    status: 'locked',
    difficulty: 'Medium',
  },
  {
    id: 6,
    title: 'Shared Objects',
    description: 'Create shared objects and enable multi-user interactions.',
    icon: '⑥',
    status: 'locked',
    difficulty: 'Hard',
  },
  {
    id: 7,
    title: 'DeFi Protocol',
    description: 'Build a simple DeFi protocol with swap and liquidity pool operations.',
    icon: '⑦',
    status: 'locked',
    difficulty: 'Hard',
  },
  {
    id: 8,
    title: 'DAO Governance',
    description: 'Create and manage a Decentralized Autonomous Organization (DAO).',
    icon: '⑧',
    status: 'locked',
    difficulty: 'Hard',
  },
];

function ProjectTabs() {
  const [activeTab, setActiveTab] = useState<number>(1);

  const activeProject = projects.find(p => p.id === activeTab) || projects[0];

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return <span className="status-badge completed">Completed</span>;
      case 'in-progress':
        return <span className="status-badge in-progress">In Progress</span>;
      case 'locked':
        return <span className="status-badge locked">Locked</span>;
    }
  };

  const getDifficultyColor = (difficulty: Project['difficulty']) => {
    switch (difficulty) {
      case 'Easy':
        return 'difficulty-easy';
      case 'Medium':
        return 'difficulty-medium';
      case 'Hard':
        return 'difficulty-hard';
    }
  };

  return (
    <div className="project-tabs-container">
      <h2 className="tabs-title">Speedrun Projects</h2>
      <p className="tabs-subtitle">
        Master the Sui blockchain by completing each project challenge
      </p>

      {/* Tab Navigation */}
      <div className="tabs-nav">
        {projects.map((project) => (
          <button
            key={project.id}
            className={`tab-button ${activeTab === project.id ? 'active' : ''} ${project.status === 'locked' ? 'locked' : ''}`}
            onClick={() => setActiveTab(project.id)}
            disabled={project.status === 'locked'}
          >
            <span className="tab-icon">{project.icon}</span>
            <span className="tab-number">{project.id}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <div className="project-header">
          <div className="project-icon-large">{activeProject.icon}</div>
          <div className="project-info">
            <div className="project-meta">
              <span className={`difficulty-badge ${getDifficultyColor(activeProject.difficulty)}`}>
                {activeProject.difficulty}
              </span>
              {getStatusBadge(activeProject.status)}
            </div>
            <h3 className="project-title">{activeProject.title}</h3>
            <p className="project-description">{activeProject.description}</p>
          </div>
        </div>

        <div className="project-body">
          {activeProject.status === 'completed' ? (
            <div className="project-completed">
              <div className="success-animation">✓</div>
              <h4>Congratulations!</h4>
              <p>You have successfully completed this task.</p>
              <div className="achievement">
                <span className="achievement-icon">★</span>
                <span>Achievement Unlocked: {activeProject.title}</span>
              </div>
            </div>
          ) : activeProject.status === 'in-progress' ? (
            <div className="project-in-progress">
              <h4>Task Description</h4>
              <p>In this project you will learn:</p>
              <ul>
                <li>Creating transactions on the Sui blockchain</li>
                <li>Secure signing with your wallet</li>
                <li>Gas fee management and optimization</li>
                <li>Reading and processing transaction results</li>
              </ul>

              <h4>Objectives</h4>
              <div className="objectives">
                <div className="objective completed">
                  <span className="objective-icon">✓</span>
                  <span>Connect wallet</span>
                </div>
                <div className="objective completed">
                  <span className="objective-icon">✓</span>
                  <span>Send authentication transaction</span>
                </div>
                <div className="objective pending">
                  <span className="objective-icon"></span>
                  <span>Complete token transfer</span>
                </div>
                <div className="objective pending">
                  <span className="objective-icon"></span>
                  <span>Review transaction details in explorer</span>
                </div>
              </div>

              <button className="action-button primary">
                <span>Start Task</span>
              </button>
            </div>
          ) : (
            <div className="project-locked">
              <div className="lock-icon">◆</div>
              <h4>This Project is Locked</h4>
              <p>Complete previous projects to unlock this one.</p>
              <div className="requirements">
                <h5>Requirements</h5>
                <ul>
                  <li>Complete Project {activeProject.id - 1}</li>
                  <li>Make at least 10 transactions</li>
                  <li>Hold at least 0.5 SUI tokens</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-header">
            <span>Overall Progress</span>
            <span className="progress-percentage">
              {Math.round((projects.filter(p => p.status === 'completed').length / projects.length) * 100)}%
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${(projects.filter(p => p.status === 'completed').length / projects.length) * 100}%` 
              }}
            />
          </div>
          <div className="progress-stats">
            <span>
              {projects.filter(p => p.status === 'completed').length} / {projects.length} Projects Completed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectTabs;

