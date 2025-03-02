"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { WalletContext } from "@/context/wallet";
import contractABI from "../landregistry.json";
import { uploadFileToIPFS } from "../pinata";
import Navbar from "@/app/components/Navbar";

const CONTRACT_ADDRESS = contractABI.address;

export default function RegisterLand() {
  const { isConnected, signer, userAddress } = useContext(WalletContext);
  const [propertyNumber, setPropertyNumber] = useState("");
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [documentHash, setDocumentHash] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isConnected || !signer) {
      alert("Please connect your wallet.");
    }
  }, [isConnected, signer]);

  async function fetchSuggestions(query) {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  }

  async function uploadDocument(e) {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const data = new FormData();
      data.set("file", file);

      setLoading(true);
      const response = await uploadFileToIPFS(data);
      if (response.success) {
        setDocumentHash(response.pinataURL);
        console.log("Document Hash:", response.pinataURL);
        alert("Document uploaded successfully!");
      } else {
        alert("Error uploading document.");
      }
    } catch (e) {
      console.error("Error during file upload:", e);
    } finally {
      setLoading(false);
    }
  }

  async function registerProperty() {
    console.log("Registering Property with:", { propertyNumber, location, documentHash, signer, userAddress });

    if (!isConnected || !signer) {
      alert("Wallet not connected. Please connect your wallet.");
      return;
    }
    if (!propertyNumber.trim()) {
      alert("Please enter a valid Property Number.");
      return;
    }
    if (!location.trim()) {
      alert("Please enter a valid location.");
      return;
    }
    if (!documentHash.trim()) {
      alert("Please upload a document.");
      return;
    }

    try {
      setLoading(true);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
      const tx = await contract.registerProperty(propertyNumber, location, documentHash);
      await tx.wait();
      alert("Property Registered Successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error registering property:", error);
      alert("Error registering property. Check the console for details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-900 text-white flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold mb-6">Register Land</h1>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-lg">
          {/* Property Number */}
          <label className="block text-sm font-medium mb-2">Property Number</label>
          <input
            type="text"
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white mb-4"
            placeholder="Enter Property Number"
            value={propertyNumber}
            onChange={(e) => setPropertyNumber(e.target.value)}
          />

          {/* Location */}
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white mb-2"
            placeholder="Enter location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              fetchSuggestions(e.target.value);
            }}
          />
          {suggestions.length > 0 && (
            <ul className="bg-gray-700 border border-gray-600 text-white rounded-md overflow-hidden">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-600 cursor-pointer"
                  onClick={() => {
                    setLocation(suggestion.display_name);
                    setSuggestions([]);
                  }}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}

          {/* Upload Document */}
          <label className="block text-sm font-medium mt-4 mb-2">Upload Document</label>
          <input
            type="file"
            className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white mb-4"
            onChange={uploadDocument}
          />
          {documentHash && (
            <p className="text-green-400 mb-4">Document uploaded: {documentHash}</p>
          )}

          {/* Register Button */}
          <button
            onClick={registerProperty}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md mt-4"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Land"}
          </button>
        </div>
      </div>
    </>
  );
}
