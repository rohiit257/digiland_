import React from "react";

export default function HeroSection() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10 w-full h-full">
        <img
          src="/space.png"
          className="object-cover object-center w-full h-full"
          alt="Background"
        />
      </div>

      {/* Gradient Overlays */}
      <img
        src="/Gradient3.svg"
        className="absolute -top-[400px] -left-[200px] w-[700px] opacity-50"
        alt="Gradient3"
      />
      <img
        src="/gradient1.svg"
        className="absolute -top-[400px] -right-[500px] sm:-right-[300px] w-[800px] opacity-70"
        alt="Gradient1"
      />

      {/* Header (Login & Signup) */}
      <div className="flex justify-between w-full px-6 sm:px-10 py-4 relative z-10">
        <div className="flex space-x-4 text-white">
          <h1 className="cursor-pointer hover:opacity-80">LOGIN</h1>
          <h1 className="cursor-pointer hover:opacity-80">SIGN UP</h1>
        </div>
        <button className="text-sm sm:text-lg px-6 sm:w-[200px] h-[48px] border border-white text-white hover:bg-white hover:text-black transition-all">
          START EXPLORING
        </button>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4">
        <h1 className="text-5xl md:text-8xl font-bold">CRYPTO SPACE</h1>
        <p className="max-w-3xl my-5 text-lg sm:text-2xl">
          A distributed gaming environment for the next generation, brought to
          the metaverse.
        </p>
        <p className="max-w-2xl text-lg sm:text-2xl">
          A multiplayer, game-arcade metaverse, where players socialize and
          compete in the most popular arcade games.
        </p>
        <button className="text-xl bg-white text-black w-[250px] sm:w-[320px] h-[60px] mt-5 font-bold hover:bg-gray-300 transition-all">
          GET STARTED
        </button>
      </div>

      {/* Bottom Gradients */}
      <img
        src="/gradient.svg"
        className="absolute -bottom-[600px] -left-[300px] w-[700px] opacity-50"
        alt="Gradient Bottom Left"
      />
      <img
        src="/Gradient2.svg"
        className="absolute -bottom-[300px] left-[400px] w-[500px] opacity-60"
        alt="Gradient Bottom Right"
      />
    </div>
  );
}
