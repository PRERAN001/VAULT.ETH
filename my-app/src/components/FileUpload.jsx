import { useState } from "react";
import axios from "axios";

const FileUpload = ({ contract, account }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [uploading, setUploading] = useState(false);

  const pinataJwt = import.meta.env.VITE_PINATA_JWT;
  const pinataGateway = import.meta.env.VITE_PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract || !account) return alert("Connect your wallet before uploading.");
    if (!file) return alert("Select a file first.");

    if (!pinataJwt) {
      alert("Missing VITE_PINATA_JWT. Add it to your my-app/.env file before uploading.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key:"ba98de106d9d9e8d73a7",
          pinata_secret_api_key:"1a359e2a44db9c413c3698788990fdd1f91ec612ad9c3cbaa4860a71e71d07c0",
          
          "Content-Type": "multipart/form-data",
        },
      });

      const fileUrl = `${pinataGateway.replace(/\/$/, "")}/${resFile.data.IpfsHash}`;
      const transaction = await contract.add(account, fileUrl);
      await transaction.wait();

      alert("File uploaded & linked on-chain.");
      setFileName("No file selected");
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      const message = error?.response?.status === 403
        ? "Pinata rejected the request. Check VITE_PINATA_JWT and Pinata upload permissions."
        : "Upload failed. View browser console.";
      alert(message);
    } finally {
      setUploading(false);
    }
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    if (data) {
      setFile(data);
      setFileName(data.name);
    }
  };

  return (
    <div className="border border-black p-8 bg-white flex flex-col justify-between h-full space-y-6">
      <div>
        <h2 className="text-xs uppercase font-mono tracking-widest text-black/50 mb-1">Upload Data</h2>
        <h3 className="text-xl font-medium tracking-tight">Pin New Asset</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border border-dashed border-black/30 p-6 text-center hover:border-black transition-colors">
          <input
            type="file"
            id="file-upload"
            onChange={retrieveFile}
            disabled={uploading}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer block text-xs tracking-wider uppercase font-medium underline underline-offset-4 mb-2"
          >
            Select Document
          </label>
          <p className="text-xs text-black/60 font-mono truncate max-w-xs mx-auto">{fileName}</p>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-black text-white hover:bg-white hover:text-black border border-black transition-all duration-200 py-3 text-xs tracking-widest uppercase font-medium disabled:opacity-40"
        >
          {uploading ? "Processing Transaction..." : "Commit To IPFS"}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;