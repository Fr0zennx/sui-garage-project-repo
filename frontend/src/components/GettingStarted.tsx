import Carousel from './ui/carousel';
import './GettingStarted.css';

interface GettingStartedProps {
  onClose: () => void;
  onStartSuiGarage?: () => void;
  onStartCharacterCard?: () => void;
  onStartNFTOwnership?: () => void;
  onStartBalance?: () => void;
  onStartSuiCar?: () => void;
  onStartSuiGallery?: () => void;
}

function GettingStarted({
  onClose,
  onStartSuiGarage,
  onStartCharacterCard,
  onStartNFTOwnership,
  onStartBalance,
  onStartSuiCar,
  onStartSuiGallery
}: GettingStartedProps) {
  const slideData = [
    {
      title: 'Level 1: Sui Garage',
      button: 'Start ',
      src: '/Sui-Garage-Development.webp',
      onClick: () => {
        onClose();
        onStartSuiGarage?.();
      },
    },
    {
      title: 'Level 2: Character Card',
      button: 'Start',
      src: '/character-card-id.webp',
      onClick: () => {
        onClose();
        onStartCharacterCard?.();
      },
    },
    {
      title: 'Level 3: NFT & Visual Ownership',
      button: 'Start',
      src: '/nft-phoenix.webp',
      onClick: () => {
        onClose();
        onStartNFTOwnership?.();
      },
    },
    {
      title: 'Level 4: Battle & Level Up',
      button: 'Start',
      src: '/battle-level-up.webp',
      onClick: () => {
        onClose();
        onStartBalance?.();
      },
    },
    {
      title: 'Level 5: Sui Car',
      button: 'Start',
      src: '/sui-car.webp',
      onClick: () => {
        onClose();
        onStartSuiCar?.();
      },
    },
    {
      title: 'Level 6: Sui Gallery',
      button: 'Start',
      src: '/sui-gallery.webp',
      onClick: () => {
        onClose();
        onStartSuiGallery?.();
      },
    },
  ];

  return (
    <div className="getting-started-overlay">
      <div className="getting-started-container">
        {/* Close button */}
        <button className="getting-started-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Carousel */}
        <div className="getting-started-content">
          <Carousel slides={slideData} />
        </div>
      </div>
    </div>
  );
}

export default GettingStarted;
