import { useState } from 'react';
import './NFTVisualOwnershipView.css';

interface NFTVisualOwnershipViewProps {
  onClose: () => void;
}

function NFTVisualOwnershipView({ onClose }: NFTVisualOwnershipViewProps) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      title: 'Introduction',
      content: `
        <h3>NFT & Visual Ownership (The Entry Ticket)</h3>
        <p><strong>In Level 1, you created data. In Level 2, you create Art.</strong> On most blockchains, wallets have to guess how to display your NFT. On Sui, we use the Display Standard—a powerful template system that tells wallets and marketplaces (like BlueMove) exactly how to render your object using on-chain data.</p>
        
        <h4>What you will learn:</h4>
        <ul>
          <li><strong>Visual Data Structures:</strong> Add image URLs and metadata to your NFTs.</li>
          <li><strong>One-Time Witness (OTW):</strong> Prove ownership of your module.</li>
          <li><strong>Display Standard:</strong> Create templates that wallets understand.</li>
          <li><strong>Minting NFTs:</strong> Generate collectible tickets programmatically.</li>
          <li><strong>Testnet Deployment:</strong> Make your NFTs live on Sui's blockchain.</li>
        </ul>
        
        <p style="color: #4da6ff; font-style: italic; margin-top: 2rem;">Ready to create visual assets? Let's begin with <strong>Chapter 1: Struct Definition</strong>!</p>
      `
    },
    {
      title: 'Chapter 1: Struct Definition',
      content: `
        <h3>Struct Definition (Adding Visual Data)</h3>
        
        <h4>The Why</h4>
        <p>To make a visual NFT, your object needs to store the "path" to its image. We use the <code>String</code> type for names, descriptions, and URLs because they are flexible and human-readable.</p>
        
        <h4>Your Goal</h4>
        <p>Expand the <code>EntryTicket</code> struct to include the metadata fields required for a collectible ticket.</p>
        
        <h4>Code to Write:</h4>
        <pre style="background: rgba(30, 144, 255, 0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; border-left: 3px solid #1e90ff;"><code>public struct EntryTicket has key, store {
    id: UID,
    name: String,
    description: String,
    url: String,
}</code></pre>
      `
    },
    {
      title: 'Chapter 2: The One-Time Witness',
      content: `
        <h3>The One-Time Witness (OTW)</h3>
        
        <h4>The Why</h4>
        <p>Security is paramount. Sui needs to ensure that only the original creator of a module can set its "Display" rules. A <strong>One-Time Witness (OTW)</strong> is a special struct that proves "I am the authorized creator of this module."</p>
        
        <h4>Key Requirements:</h4>
        <ul>
          <li>Must have the exact same name as the module (but in UPPERCASE).</li>
          <li>Must have the <code>drop</code> ability.</li>
          <li>Is automatically passed to the <code>init</code> function by the network.</li>
        </ul>
        
        <h4>Your Goal</h4>
        <p>Define the OTW struct for your nft module.</p>
        
        <h4>Code to Write:</h4>
        <pre style="background: rgba(30, 144, 255, 0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; border-left: 3px solid #1e90ff;"><code>public struct NFT has drop {}</code></pre>
      `
    },
    {
      title: 'Chapter 3: Initialization & Display',
      content: `
        <h3>Initialization & Display (The Metadata Template)</h3>
        
        <h4>The Why</h4>
        <p>This is the most critical step. Instead of hardcoding metadata for every single NFT, we create a <strong>Template</strong>.</p>
        
        <h4>Key Concepts:</h4>
        <ul>
          <li><strong>package::claim:</strong> Uses your OTW to prove ownership and receive a Publisher object.</li>
          <li><strong>display::new_with_fields:</strong> Creates the mapping. Notice the <code>{name}</code> syntax? This tells Sui: "Look inside the EntryTicket object, find the 'name' field, and put its value here."</li>
          <li><strong>update_version:</strong> Activates the display rules.</li>
        </ul>
        
        <h4>Your Goal</h4>
        <p>Setup the init function to map your struct fields to the Sui Display standards.</p>
        
        <h4>Code to Write:</h4>
        <pre style="background: rgba(30, 144, 255, 0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; border-left: 3px solid #1e90ff;"><code>fun init(otw: NFT, ctx: &mut TxContext) {
    let keys = vector[
        utf8(b"name"),
        utf8(b"image_url"),
        utf8(b"description"),
    ];

    let values = vector[
        utf8(b"{name}"),
        utf8(b"{url}"),
        utf8(b"{description}"),
    ];

    let publisher = package::claim(otw, ctx);
    let mut display = display::new_with_fields<EntryTicket>(
        &publisher, keys, values, ctx
    );

    display::update_version(&mut display);

    transfer::public_transfer(publisher, tx_context::sender(ctx));
    transfer::public_transfer(display, tx_context::sender(ctx));
}</code></pre>
      `
    },
    {
      title: 'Chapter 4: The Minting Function',
      content: `
        <h3>The Minting Function</h3>
        
        <h4>The Why</h4>
        <p>Now that the rules are set, we need a way to create the actual tickets. We take <code>vector&lt;u8&gt;</code> (raw bytes) from the user and convert them to <code>String</code> so they match our struct definition. By transferring the ticket to the sender, it will immediately appear in their wallet with the image defined by the URL.</p>
        
        <h4>Your Goal</h4>
        <p>Complete the <code>mint_ticket</code> function to initialize the EntryTicket and deliver it to the user.</p>
        
        <h4>Code to Write:</h4>
        <pre style="background: rgba(30, 144, 255, 0.1); padding: 1rem; border-radius: 8px; overflow-x: auto; border-left: 3px solid #1e90ff;"><code>public entry fun mint_ticket(
    name: vector<u8>,
    description: vector<u8>,
    url: vector<u8>,
    ctx: &mut TxContext
) {
    let ticket = EntryTicket {
        id: object::new(ctx),
        name: string::utf8(name),
        description: string::utf8(description),
        url: string::utf8(url),
    };

    transfer::public_transfer(ticket, tx_context::sender(ctx));
}</code></pre>
      `
    },
    {
      title: 'Chapter 5: Deploying to Testnet',
      content: `
        <h3>Deploying to Sui Testnet</h3>
        
        <h4>The Goal</h4>
        <p>You have written the logic for your NFT. Now, it's time to move it from your local editor to the global Sui Testnet. This will make your contract "live," allowing anyone to view it on the blockchain explorer and interact with it using a real wallet.</p>
        
        <h4>Step 1: Configure Your Environment</h4>
        <p>By default, your CLI might be pointing to a local network or Devnet. You need to switch it to Testnet to ensure your NFT is visible to the wider community.</p>
        <ul>
          <li><strong>Check environment:</strong> <code>sui client active-env</code></li>
          <li><strong>Switch to Testnet:</strong> <code>sui client switch --env testnet</code></li>
        </ul>
        
        <h4>Step 2: Create Your Wallet</h4>
        <p>Before you can own anything or deploy code, you need a Sui address. If you don't have a wallet configured in your CLI yet, you need to create one.</p>
        <ul>
          <li><strong>Command:</strong> <code>sui client new-address ed25519</code></li>
          <li>This will generate your Sui Address and a Recovery Phrase. Keep your recovery phrase secret!</li>
        </ul>
        
        <h4>Step 3: Fund Your Wallet (The Faucet)</h4>
        <p>Every action on the blockchain requires "Gas" (transaction fees). You cannot publish your contract with an empty wallet. Since we are on Testnet, you can get SUI tokens for free.</p>
        <ul>
          <li><strong>CLI Command:</strong> <code>sui client faucet</code></li>
          <li><strong>Discord Option:</strong> Join the Sui Discord and paste your address in the #testnet-faucet channel.</li>
          <li><strong>Verify Balance:</strong> Run <code>sui client gas</code> to see your test tokens.</li>
        </ul>
        
        <h4>Step 4: Build Your Contract</h4>
        <p>Before publishing, you must ensure your code is error-free. This command compiles your Move code into "bytecode" that the Sui Virtual Machine can understand.</p>
        <ul>
          <li><strong>Command:</strong> <code>sui move build</code></li>
        </ul>
        
        <h4>Step 5: Publish to the Blockchain</h4>
        <p>This is the final "Push." You are sending your compiled package to the Sui validators to be permanently recorded on the ledger using the gas tokens you just received.</p>
        <ul>
          <li><strong>Command:</strong> <code>sui client publish --gas-budget 100000000</code></li>
        </ul>
        
        <h4>Verifying Your Success</h4>
        <p>Once the command finishes, look for the "PackageID" in the terminal output.</p>
        <ul>
          <li>Copy the PackageID.</li>
          <li>Go to <strong>suiscan.xyz</strong>.</li>
          <li>Paste your ID into the search bar.</li>
          <li>You will see your NFT contract officially registered and live on the blockchain!</li>
        </ul>
      `
    }
  ];

  return (
    <div className="nft-ownership-overlay">
      <div className="nft-ownership-container">
        <button className="nft-ownership-close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="nft-ownership-header">
          <h1>NFT & Visual Ownership</h1>
        </div>

        <div className="nft-ownership-tabs">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`nft-ownership-tab ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.title}
            </button>
          ))}
        </div>

        <div className="nft-ownership-content">
          <div
            dangerouslySetInnerHTML={{
              __html: tabs[activeTab].content,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default NFTVisualOwnershipView;
