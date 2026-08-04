import { useState } from "react";
import { ethers } from "ethers";

const DisplayFiles = ({ contract, account }) => {
  const [data, setData] = useState([]);
  const [targetAddress, setTargetAddress] = useState("");

  const getData = async () => {
    try {
      if (!contract) {
        alert("Connect your wallet before querying files.");
        return;
      }

      const addressToQuery = targetAddress.trim() || account;
      if (!addressToQuery) {
        alert("Connect your wallet or enter a valid address.");
        return;
      }

      if (!ethers.utils.isAddress(addressToQuery)) {
        alert("Please enter a valid 0x wallet address.");
        return;
      }

      const normalizedAddress = ethers.utils.getAddress(addressToQuery);
      const dataArray = await contract.display(normalizedAddress);

      if (dataArray.length === 0) {
        alert("No assets found for this address.");
        setData([]);
        return;
      }
      setData(dataArray);
    } catch (error) {
      alert("Access Denied: You do not have ownership or granted permissions.");
      console.error(error);
    }
  };

  return (
    <div className="border border-black p-8 bg-white space-y-6">
      <div>
        <h2 className="text-xs uppercase font-mono tracking-widest text-black/50 mb-1">Explorer</h2>
        <h3 className="text-xl font-medium tracking-tight">Retrieve Stored Assets</h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Query Address (leave blank for self)"
          value={targetAddress}
          onChange={(e) => setTargetAddress(e.target.value)}
          className="flex-1 border border-black px-4 py-2.5 text-xs font-mono outline-none focus:ring-1 focus:ring-black placeholder:text-black/40"
        />
        <button
          onClick={getData}
          disabled={!contract}
          className="bg-black text-white hover:bg-white hover:text-black border border-black transition-all duration-200 px-6 py-2.5 text-xs tracking-widest uppercase font-medium"
        >
          Query
        </button>
      </div>

      {/* Asset Display Gallery */}
      <div className="min-h-55 border border-black/10 p-4">
        {data.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {data.map((item, i) => (
              <a
                key={i}
                href={item}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative border border-black/20 overflow-hidden aspect-square block bg-black/5"
              >
                <img
                  src={item}
                  alt={`Asset ${i}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x300/ffffff/000000?text=DOCUMENT";
                  }}
                />
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-mono tracking-widest uppercase">
                  View File ↗
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-xs text-black/40 font-mono">
            [ Dynamic Vault Empty ]
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayFiles;