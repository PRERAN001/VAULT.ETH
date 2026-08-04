import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import FileUpload from "./components/FileUpload";
import DisplayFiles from "./components/DisplayFiles";
import ShareAccessModal from "./components/ShareAccessModal";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);

          window.ethereum.on("chainChanged", () => window.location.reload());
          window.ethereum.on("accountsChanged", () => window.location.reload());

          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
          const contractInstance = new ethers.Contract(
            contractAddress,
            Upload.abi,
            signer
          );

          setContract(contractInstance);
        } catch (error) {
          console.error("Error connecting to Web3:", error);
        }
      } else {
        console.error("MetaMask is not installed.");
      }
    };

    initWeb3();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 text-black font-sans antialiased selection:bg-black selection:text-white">
      {/* Navigation Header */}
      <nav className="border-b border-black/10 bg-white/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold tracking-widest">
              3
            </div>
            <span className="font-semibold text-lg tracking-tight">VAULT.ETH</span>
          </div>

          <div>
            {account ? (
              <div className="flex items-center space-x-2 border border-black rounded-full px-4 py-1.5 text-xs font-medium tracking-wide">
                <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
                <span>{`${account.substring(0, 6)}...${account.substring(38)}`}</span>
              </div>
            ) : (
              <span className="text-xs font-medium border border-dashed border-black/40 px-4 py-1.5 rounded-full text-black/60">
                Wallet Disconnected
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section & Controls */}
      <main className="max-w-6xl mx-auto px-6 pt-12 pb-24 space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-black pb-8 gap-6">
          <div>
            <p className="text-xs tracking-widest uppercase text-black/50 font-mono mb-2">
              Decentralized File Network
            </p>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">
              On-Chain Storage Management
            </h1>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="self-start md:self-auto bg-black text-white hover:bg-white hover:text-black border border-black transition-all duration-200 px-6 py-3 rounded-none text-xs tracking-widest uppercase font-medium"
          >
            Access Permissions
          </button>
        </header>

        {/* Core Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <FileUpload account={account} contract={contract} />
          </div>
          <div className="lg:col-span-7">
            <DisplayFiles contract={contract} account={account} />
          </div>
        </div>
      </main>

      {/* Sharing Modal */}
      {modalOpen && (
        <ShareAccessModal contract={contract} closeModal={() => setModalOpen(false)} />
      )}
    </div>
  );
}

export default App;