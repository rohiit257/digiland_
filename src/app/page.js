import Image from "next/image";
import { Homepage } from "./components/Homepage";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
    <Navbar/>
    <Homepage/>
    {/* <HeroSection/> */}
    </>
  );
}
