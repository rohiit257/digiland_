"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { ethers } from "ethers";
import { WalletContext } from "@/context/wallet";
import contractABI from "../../landregistry.json";
import GetIpfsUrlFromPinata from "@/app/utils";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/app/components/Map"), { ssr: false });

const CONTRACT_ADDRESS = contractABI.address;

export default function PropertyDetails() {
  const { isConnected, signer } = useContext(WalletContext);
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isConnected || !signer) return;
    fetchPropertyDetails();
    fetchTransactionHistory();
  }, [isConnected, signer, id]);

  async function fetchPropertyDetails() {
    if (!signer) return;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
    try {
      const propertyData = await contract.getProperty(parseInt(id));
      console.log(propertyData);
      
      if (!propertyData || propertyData.length < 5) {
        throw new Error("Invalid property data");
      }

      const formattedProperty = {
        id: parseInt(id),
        propertyNo: propertyData[1],
        owner: propertyData[2],
        location: propertyData[3],
        documentHash: propertyData[4],
        isVerified: propertyData[5],
      };
      setProperty(formattedProperty);
      parseCoordinates(formattedProperty.location);
    } catch (error) {
      console.error("Error fetching property details:", error);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTransactionHistory() {
    if (!signer) return;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
    try {
        const transactionData = await contract.getTransactionHistory(id);
        setTransactions(transactionData);
    } catch (error) {
        console.error("Error fetching transaction history:", error);
    }
  }

  async function parseCoordinates(location) {
    const regex = /([-+]?\d{1,2}\.\d+),\s*([-+]?\d{1,3}\.\d+)/;
    const match = location.match(regex);

    if (match) {
      setCoordinates({ lat: parseFloat(match[1]), lng: parseFloat(match[2]) });
    } else {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
        );
        const data = await response.json();
        if (data.length > 0) {
          setCoordinates({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
        } else {
          console.error("No coordinates found for address:", location);
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <p>Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <p>Error: Property not found.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-4xl font-bold mb-6">Property Details</h1>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-6xl">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
            <div className="flex-shrink-0">
              {property.documentHash && (
                <Image
                  src={GetIpfsUrlFromPinata(property.documentHash)}
                  alt="Property Document"
                  width={400}
                  height={400}
                  className="w-[400px] h-[400px] rounded-md object-cover border border-gray-700"
                />
              )}
            </div>
            <div className="flex-1 text-left space-y-4">
              <p className="text-lg"><strong>Property ID:</strong> {property.id.toString()}</p>
              <p className="text-lg"><strong>Property No:</strong> {property.propertyNo}</p>
              <p className="text-lg"><strong>Owner:</strong> {property.owner}</p>
              <p className="text-lg"><strong>Location:</strong> {property.location}</p>
              <p className="text-lg"><strong>Verified:</strong> {property.isVerified ? "✅ Yes" : "❌ No"}</p>
              <button onClick={() => setDialogOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Records</button>
            </div>
          </div>

          {coordinates && (
            <div className="mt-8">
              <h2 className="text-lg font-bold">Property Location</h2>
              <Map coordinates={coordinates} />
            </div>
          )}
        </div>
      </div>

      {dialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-lg">
            <h2 className="text-xl font-bold mb-4 text-black">Transaction Records</h2>
            <ul className="text-black">
              {transactions.length > 0 ? transactions.map((tx, index) => (
                <li key={index}>Hash: {tx.hash}</li>
              )) : <p>No transactions found.</p>}
            </ul>
            <button onClick={() => setDialogOpen(false)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Close</button>
          </div>
        </div>
      )}
    </>
  );
}
