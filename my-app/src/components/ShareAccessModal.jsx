import { useState, useEffect } from "react";

const ShareAccessModal = ({ contract, closeModal }) => {
  const [addressToShare, setAddressToShare] = useState("");
  const [accessList, setAccessList] = useState([]);

  useEffect(() => {
    if (!contract) return;

    const fetchAccessList = async () => {
      try {
        const list = await contract.share_access();
        setAccessList(list);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAccessList();
  }, [contract]);

  const refreshAccessList = async () => {
    if (!contract) return;

    try {
      const list = await contract.share_access();
      setAccessList(list);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGrantAccess = async () => {
    if (!contract || !addressToShare) return;
    try {
      const tx = await contract.give_access(addressToShare);
      await tx.wait();
      alert("Permission updated.");
      setAddressToShare("");
      refreshAccessList();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRevokeAccess = async (userAddress) => {
    if (!contract) return;
    try {
      const tx = await contract.remove_Access(userAddress);
      await tx.wait();
      alert("Access revoked.");
      refreshAccessList();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-black max-w-md w-full p-8 space-y-6 relative shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-black/50">Security</h3>
            <h4 className="text-xl font-medium tracking-tight">Manage Permissions</h4>
          </div>
          <button
            onClick={closeModal}
            className="text-xl font-light hover:opacity-50 transition-opacity"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          <input
            type="text"
            placeholder="0x... Target Wallet Address"
            value={addressToShare}
            onChange={(e) => setAddressToShare(e.target.value)}
            className="w-full border border-black px-4 py-2.5 text-xs font-mono outline-none focus:ring-1 focus:ring-black placeholder:text-black/40"
          />
          <button
            onClick={handleGrantAccess}
            className="w-full bg-black text-white hover:bg-white hover:text-black border border-black transition-all duration-200 py-2.5 text-xs tracking-widest uppercase font-medium"
          >
            Authorize Account
          </button>
        </div>

        <div className="space-y-3 pt-2">
          <h5 className="text-xs font-mono uppercase tracking-widest border-b border-black/10 pb-1">
            Access Registry
          </h5>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {accessList.length > 0 ? (
              accessList.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border border-black/10 p-2 text-xs font-mono"
                >
                  <span className="truncate max-w-45">{item.user}</span>
                  {item.access ? (
                    <button
                      onClick={() => handleRevokeAccess(item.user)}
                      className="border border-black px-2 py-1 text-[10px] uppercase hover:bg-black hover:text-white transition-colors"
                    >
                      Revoke
                    </button>
                  ) : (
                    <span className="text-black/40 italic text-[10px]">Disabled</span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-black/40 font-mono py-2">No dynamic permissions granted.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareAccessModal;