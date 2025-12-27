import { 
  useCurrentAccount, 
  ConnectButton,
  useDisconnectWallet
} from '@mysten/dapp-kit';
import { useState } from 'react';
import React from 'react';
import { VscAccount } from 'react-icons/vsc';
import { TracingBeam } from './ui/tracing-beam';
import Profile from './Profile';
import SlideArrowButton from './SlideArrowButton';
import GettingStarted from './GettingStarted';
import './SpeedrunDashboard.css';

// Content Data
const contentData = [
  {
    title: "Level 1: Sui Garage Development",
    description: (
      <>
        <p>
          Sui Speedrun is an interactive learning platform designed to help developers 
          master the Sui blockchain through hands-on projects. Each level introduces 
          new concepts and challenges that build upon your knowledge progressively.
        </p>
        <p>
          Start your journey by connecting your wallet and completing the first 
          transaction. This will authenticate your account and unlock access to 
          all learning modules.
        </p>
        <p>
          The platform covers everything from basic Move programming to advanced 
          topics like NFTs, object ownership, and decentralized applications on Sui.
        </p>
      </>
    ),
    badge: "Introduction",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=3432&auto=format&fit=crop",
  },
  {
    title: "Level 2: Character Card",
    description: (
      <>
        <p>
          Sui Move is a powerful programming language designed for building secure 
          and efficient smart contracts. It provides unique features like object-centric 
          design and strong ownership semantics that make blockchain development safer.
        </p>
        <p>
          Through our structured curriculum, you'll learn how to create, deploy, and 
          interact with Move modules on the Sui blockchain. Each lesson includes 
          practical examples and real-world use cases.
        </p>
      </>
    ),
   
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=3472&auto=format&fit=crop",
  },
  {
    title: "Level 3: NFT & Visual Ownership",
    description: (
      <>
        <p>
          Put your knowledge into practice by building complete decentralized applications. 
          Learn how to design smart contracts, manage state, handle transactions, and 
          create user-friendly interfaces for blockchain interactions.
        </p>
        <p>
          Our project-based approach ensures you gain practical experience with real-world 
          scenarios, from simple token transfers to complex NFT marketplaces and gaming 
          applications.
        </p>
      </>
    ),
   
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=3540&auto=format&fit=crop",
  },
  {
    title: "Level 4: Battle & Level Up",
    description: (
      <>
        <p>
          Dive deep into advanced Sui concepts including object capabilities, dynamic fields, 
          and composable smart contracts. Learn how to optimize gas costs and implement 
          best practices for security and efficiency.
        </p>
        <p>
          Complete all levels to become a certified Sui developer and join the growing 
          community of blockchain innovators building the future of decentralized technology.
        </p>
      </>
    ),
    
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=3540&auto=format&fit=crop",
  },
  {
    title: "Level 5: Sui Car",
    description: (
      <>
        <p>
          Build dynamic NFT systems with programmable transactions. Learn how to create
          upgradeable objects, implement custom transfer policies, and manage complex
          ownership structures on the Sui blockchain.
        </p>
        <p>
          Master the art of building interactive NFT collections with real-time state
          management and advanced object composition techniques.
        </p>
      </>
    ),
    
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=3540&auto=format&fit=crop",
  },
  {
    title: "Level 6: Sui Gallery",
    description: (
      <>
        <p>
          Create a complete NFT marketplace with advanced features including auctions,
          royalties, and dynamic pricing. Implement sophisticated smart contract patterns
          and build a production-ready decentralized application.
        </p>
        <p>
          Graduate as a Sui expert by deploying your own NFT gallery with full marketplace
          functionality and community features.
        </p>
      </>
    ),
    
    image:
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?q=80&w=3540&auto=format&fit=crop",
  },
];

function SpeedrunDashboard() {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnectWallet } = useDisconnectWallet();
  const [showProfile, setShowProfile] = useState(false);
  const [showGettingStarted, setShowGettingStarted] = useState(false);

  const handleDisconnect = () => {
    disconnectWallet();
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <img 
              src="https://cryptologos.cc/logos/sui-sui-logo.png"
              alt="Sui Logo"
              className="sui-logo"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src.includes('cryptologos')) {
                  target.src = 'https://s2.coinmarketcap.com/static/img/coins/200x200/20947.png';
                }
              }}
            />
            <h1 className="logo-text">Sui Garage</h1>
          </div>
          
          <div className="header-actions">
            {!currentAccount ? (
              <ConnectButton className="connect-btn" />
            ) : (
              <div className="wallet-info">
                <button className="profile-btn" onClick={() => setShowProfile(true)}>
                  <VscAccount size={18} />
                  Profile
                </button>
                <div className="wallet-badge">
                  <VscAccount size={18} />
                  <span className="wallet-address">
                    {currentAccount.address.substring(0, 6)}...{currentAccount.address.substring(currentAccount.address.length - 4)}
                  </span>
                </div>
                <button className="disconnect-btn" onClick={handleDisconnect}>
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Get Started Button */}
        <div className="get-started-section">
          <h2 className="welcome-title">Welcome to Sui Garage</h2>
          <p className="welcome-subtitle"></p>
          <SlideArrowButton 
            text="Get Started" 
            primaryColor="#00bcd4"
            onClick={() => setShowGettingStarted(true)}
          />
        </div>

        <TracingBeam className="tracing-beam-wrapper">
          <div className="content-wrapper">
            {contentData.map((item, index) => (
              <div key={`content-${index}`} className="content-item">
                <h2 className="content-badge">
                  {item.badge}
                </h2>

                <p className="content-title">
                  {item.title}
                </p>

                <div className="content-description">
                  {item?.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="content-image"
                    />
                  )}
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </TracingBeam>
      </main>

      {/* Profile Modal */}
      {showProfile && currentAccount && (
        <Profile onClose={() => setShowProfile(false)} />
      )}

      {/* Getting Started Modal */}
      {showGettingStarted && (
        <GettingStarted 
          onClose={() => setShowGettingStarted(false)}
          onStartSuiGarage={() => setShowGettingStarted(false)}
        />
      )}
    </div>
  );
}

export default SpeedrunDashboard;
