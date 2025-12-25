import { useState } from 'react';
import './SuiCarView.css';

interface SuiCarViewProps {
  onClose: () => void;
}

function SuiCarView({ onClose }: SuiCarViewProps) {
  const [activeChapter, setActiveChapter] = useState(0);

  const chapters = [
    {
      title: 'Introduction',
      content: `
        <h3>Welcome to Sui Car</h3>
        <p>In this module, you will learn about on-chain transactions, activities, and how to interact with the Sui blockchain. Master the tools and concepts needed to build real-world applications.</p>
        
        <h4>What you will achieve:</h4>
        <ul>
          <li><strong>Transaction Understanding:</strong> Learn how transactions work on Sui.</li>
          <li><strong>On-Chain Activities:</strong> Understand tracking and verification of blockchain activities.</li>
          <li><strong>Real-World Interactions:</strong> Build practical experience with live blockchain interactions.</li>
        </ul>
      `
    },
    {
      title: 'Chapter 1',
      content: `
        <h3>Chapter 1</h3>
        <p>Content will be added here.</p>
      `
    },
    {
      title: 'Chapter 2',
      content: `
        <h3>Chapter 2</h3>
        <p>Content will be added here.</p>
      `
    },
    {
      title: 'Chapter 3',
      content: `
        <h3>Chapter 3</h3>
        <p>Content will be added here.</p>
      `
    },
    {
      title: 'Chapter 4',
      content: `
        <h3>Chapter 4</h3>
        <p>Content will be added here.</p>
      `
    }
  ];

  return (
    <div className="sui-car-fullscreen">
      <button className="sui-car-close-btn" onClick={onClose}>
        ✕
      </button>

      <div className="sui-car-header-section">
        <h1 className="sui-car-title">Sui Car</h1>
      </div>

      <div className="sui-car-tabs">
        {chapters.map((chapter, index) => (
          <button
            key={index}
            className={`sui-car-tab ${activeChapter === index ? 'active' : ''}`}
            onClick={() => setActiveChapter(index)}
          >
            {chapter.title}
          </button>
        ))}
      </div>

      <div className="sui-car-main-content">
        <div
          className="sui-car-chapter-content"
          dangerouslySetInnerHTML={{ __html: chapters[activeChapter].content }}
        />
      </div>
    </div>
  );
}

export default SuiCarView;
