import { useState } from 'react';
import './SuiCarView.css';

interface SuiGalleryViewProps {
  onClose: () => void;
}

function SuiGalleryView({ onClose }: SuiGalleryViewProps) {
  const [activeChapter, setActiveChapter] = useState(0);

  const chapters = [
    {
      title: 'Introduction',
      content: `
        <h1>Sui Gallery: NFT Collections and Visual Assets</h1>
        <p>Welcome to the <strong>Sui Gallery</strong> development guide. This comprehensive curriculum teaches you how to create, manage, and showcase NFT collections on the Sui blockchain.</p>
        
        <p>Unlike traditional digital galleries, Sui Gallery leverages the power of Sui's object model to create dynamic, composable, and truly owned digital assets. Each NFT is not just a token reference—it's a full, independent object with its own state, metadata, and capabilities.</p>
        
        <h2>Learning Objectives</h2>
        <p>By completing this comprehensive guide, you will master:</p>
        <ul>
          <li><strong>NFT Standard Implementation:</strong> Learn the Sui NFT standard and how to create compliant, transferable digital assets.</li>
          <li><strong>Metadata Management:</strong> Store and manage rich metadata including images, descriptions, and custom attributes on-chain.</li>
          <li><strong>Collection Management:</strong> Group NFTs into collections with proper ownership and access control.</li>
          <li><strong>Dynamic Properties:</strong> Implement mutable NFT properties that can be updated while preserving ownership.</li>
          <li><strong>Market Integration:</strong> Prepare your NFTs for marketplace integration and secondary sales.</li>
        </ul>
        
        <h2>Curriculum Structure</h2>
        <p>This guide is organized into five comprehensive modules:</p>
        <ol>
          <li><strong>Module 1: NFT Data Structures:</strong> Define the core schema for your NFT collections.</li>
          <li><strong>Module 2: Minting and Creation:</strong> Implement factory logic to create new NFTs.</li>
          <li><strong>Module 3: Collection Management:</strong> Organize NFTs into collections with metadata.</li>
          <li><strong>Module 4: Dynamic Properties:</strong> Add and modify NFT attributes post-minting.</li>
          <li><strong>Module 5: Marketplace Ready:</strong> Prepare NFTs for trading and showcase.</li>
        </ol>
        
        <p>Upon completion, you will have built a production-ready NFT collection system capable of supporting complex digital asset ecosystems.</p>
        
        <h2>Getting Started</h2>
        <p>Navigate through the modules to learn each aspect of NFT creation and management on Sui. Each module includes detailed code examples and implementation tasks.</p>
      `
    },
    {
      title: 'Module 1: NFT Data Structures',
      content: `
        <h1>Module 1: NFT Data Structures</h1>
        <p>The foundation of any NFT system is the data structure that defines what an NFT is. In Sui, this means creating Move objects with the proper abilities and fields.</p>
        
        <h2>Core Concepts</h2>
        <p>An NFT in Sui is fundamentally a unique object with:</p>
        <ul>
          <li><strong>Uniqueness:</strong> A UID that guarantees global uniqueness on the blockchain.</li>
          <li><strong>Ownership:</strong> The ability to be owned and transferred by users.</li>
          <li><strong>Metadata:</strong> Rich data describing the asset (name, description, image URL, attributes).</li>
          <li><strong>Extensibility:</strong> The capability to add new fields and behaviors over time.</li>
        </ul>
        
        <h2>Implementation Task</h2>
        <p>Create the following data structures for your NFT collection:</p>
        
        <pre><code>// === MODULE 1: NFT DATA STRUCTURES ===

public struct NFT has key, store {
    id: UID,
    name: String,
    description: String,
    image_url: String,
    // TODO: Add creator (address)
    // TODO: Add collection (String)
    // TODO: Add properties (vector of custom attributes)
}

public struct NFTMetadata has store {
    // TODO: Add attribute_name (String)
    // TODO: Add attribute_value (String)
}

public struct Collection has key {
    id: UID,
    name: String,
    // TODO: Add owner (address)
    // TODO: Add total_minted (u64)
    // TODO: Add description (String)
}

public struct NFTMintedEvent has copy, drop {
    // TODO: Add nft_id (ID)
    // TODO: Add name (String)
    // TODO: Add creator (address)
}</code></pre>
      `
    },
    {
      title: 'Module 2: Minting and Creation',
      content: `
        <h1>Module 2: Minting and Creation</h1>
        <p>Minting is the process of creating new NFTs. This module teaches you how to implement the factory logic that creates unique digital assets and registers them in collections.</p>
        
        <h2>Technical Requirements</h2>
        <p>You will implement:</p>
        
        <h3>Collection Creation:</h3>
        <ul>
          <li>Create a new Collection object with a unique ID.</li>
          <li>Store collection metadata on-chain.</li>
          <li>Transfer collection ownership to the creator.</li>
        </ul>
        
        <h3>NFT Minting:</h3>
        <ul>
          <li>Accept parameters for name, description, and image URL.</li>
          <li>Create a unique NFT object with proper struct initialization.</li>
          <li>Emit a NFTMintedEvent to notify the UI.</li>
          <li>Transfer the NFT to the minter's address.</li>
        </ul>
        
        <h2>Implementation Task</h2>
        
        <pre><code>// === MODULE 2: MINTING & CREATION ===

public entry fun create_collection(
    name: vector&lt;u8&gt;,
    description: vector&lt;u8&gt;,
    ctx: &mut TxContext
) {
    let collection = Collection {
        id: object::new(ctx),
        name: string::utf8(name),
        // TODO: Initialize total_minted to 0
        // TODO: Set owner to tx_context::sender(ctx)
        // TODO: Set description
    };
    
    // TODO: Transfer collection to the sender
}

public entry fun mint_nft(
    name: vector&lt;u8&gt;,
    description: vector&lt;u8&gt;,
    image_url: vector&lt;u8&gt;,
    ctx: &mut TxContext
) {
    let nft = NFT {
        id: object::new(ctx),
        name: string::utf8(name),
        description: string::utf8(description),
        image_url: string::utf8(image_url),
        // TODO: Set creator to sender
        // TODO: Initialize collection
        // TODO: Initialize properties vector
    };
    
    // TODO: Emit NFTMintedEvent
    // TODO: Transfer NFT to sender
}</code></pre>
      `
    },
    {
      title: 'Module 3: Collection Management',
      content: `
        <h1>Module 3: Collection Management</h1>
        <p>Collections organize NFTs into cohesive groups with shared governance and metadata. This module teaches you how to manage collections and associate NFTs with them.</p>
        
        <h2>Key Concepts</h2>
        <ul>
          <li><strong>Collection Ownership:</strong> Only the collection creator can mint new items in their collection.</li>
          <li><strong>Member Registration:</strong> Track which NFTs belong to which collection.</li>
          <li><strong>Metadata Inheritance:</strong> Collections provide shared metadata for their members.</li>
          <li><strong>Access Control:</strong> Use the AdminCap pattern to restrict collection operations.</li>
        </ul>
        
        <h2>Implementation Task</h2>
        
        <pre><code>// === MODULE 3: COLLECTION MANAGEMENT ===

public struct CollectionAdmin has key { id: UID }

public entry fun mint_nft_in_collection(
    collection: &mut Collection,
    admin: &CollectionAdmin,
    name: vector&lt;u8&gt;,
    description: vector&lt;u8&gt;,
    image_url: vector&lt;u8&gt;,
    ctx: &mut TxContext
) {
    // TODO: Verify admin owns the collection
    
    let nft = NFT {
        id: object::new(ctx),
        name: string::utf8(name),
        description: string::utf8(description),
        image_url: string::utf8(image_url),
        // TODO: Set collection reference
        // TODO: Set creator to sender
        // TODO: Initialize properties
    };
    
    // TODO: Increment collection.total_minted
    // TODO: Emit NFTMintedEvent
    // TODO: Transfer NFT to sender
}

public entry fun update_collection_metadata(
    collection: &mut Collection,
    admin: &CollectionAdmin,
    new_description: vector&lt;u8&gt;,
) {
    // TODO: Verify admin authority
    // TODO: Update collection description
}</code></pre>
      `
    },
    {
      title: 'Module 4: Dynamic Properties',
      content: `
        <h1>Module 4: Dynamic Properties</h1>
        <p>NFTs in Sui can have mutable properties that change over time. This module teaches you how to add custom attributes to NFTs and modify them while preserving immutability guarantees.</p>
        
        <h2>Dynamic Updates</h2>
        <p>Unlike immutable metadata, dynamic properties allow NFTs to evolve:</p>
        <ul>
          <li><strong>Level Systems:</strong> Track NFT progression (e.g., character levels in games).</li>
          <li><strong>Trait Updates:</strong> Modify attributes through in-game actions.</li>
          <li><strong>Experience Tracking:</strong> Record accumulated progress on-chain.</li>
          <li><strong>History Preservation:</strong> Maintain an immutable record of all changes via events.</li>
        </ul>
        
        <h2>Implementation Task</h2>
        
        <pre><code>// === MODULE 4: DYNAMIC PROPERTIES ===

public entry fun add_property(
    nft: &mut NFT,
    property_name: vector&lt;u8&gt;,
    property_value: vector&lt;u8&gt;,
    ctx: &mut TxContext
) {
    let metadata = NFTMetadata {
        attribute_name: string::utf8(property_name),
        attribute_value: string::utf8(property_value),
    };
    
    // TODO: Add metadata to nft.properties vector
    
    // TODO: Emit PropertyAddedEvent
}

public entry fun update_property(
    nft: &mut NFT,
    property_index: u64,
    new_value: vector&lt;u8&gt;,
) {
    // TODO: Validate property_index
    // TODO: Update the property at the index
    // TODO: Emit PropertyUpdatedEvent
}</code></pre>
      `
    },
    {
      title: 'Module 5: Marketplace Ready',
      content: `
        <h1>Module 5: Marketplace Ready</h1>
        <p>The final module prepares your NFTs for real-world use cases including marketplace integration, royalties, and secondary market transactions.</p>
        
        <h2>Marketplace Features</h2>
        <p>Production-ready NFTs require:</p>
        <ul>
          <li><strong>Royalty Support:</strong> Enable creators to earn from secondary sales.</li>
          <li><strong>Trading Standards:</strong> Implement standardized listing and purchasing mechanisms.</li>
          <li><strong>Bulk Operations:</strong> Support creating and managing large collections efficiently.</li>
          <li><strong>Verification:</strong> Provide provenance and authenticity proof on-chain.</li>
        </ul>
        
        <h2>Implementation Task</h2>
        
        <pre><code>// === MODULE 5: MARKETPLACE READY ===

public struct Royalty has store {
    // TODO: Add creator_address (address)
    // TODO: Add percentage (u64) - basis points (0-10000)
}

public entry fun list_nft_for_sale(
    nft: &NFT,
    price: u64,
    ctx: &mut TxContext
) {
    // TODO: Create a listing object
    // TODO: Store price and NFT reference
    // TODO: Emit ListingCreatedEvent
}

public entry fun purchase_nft(
    listing_id: ID,
    payment: Coin&lt;SUI&gt;,
    ctx: &mut TxContext
) {
    // TODO: Verify payment amount
    // TODO: Distribute payment including royalties
    // TODO: Transfer NFT to buyer
    // TODO: Emit SaleCompletedEvent
}

public entry fun transfer_nft(
    nft: &mut NFT,
    recipient: address,
) {
    // TODO: Update NFT owner
    // TODO: Emit TransferEvent
}</code></pre>
      `
    }
  ];

  return (
    <div className="sui-car-fullscreen">
      <button className="sui-car-close-btn" onClick={onClose}>
        ✕
      </button>

      <div className="sui-car-header-section">
        <h1 className="sui-car-title">Sui Gallery</h1>
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

export default SuiGalleryView;
