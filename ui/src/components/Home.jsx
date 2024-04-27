import './Home.css';
import React from 'react';

function Home() {
  return (
    <div className="relative h-screen mt-[3rem]">
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <video className="w-full h-full" autoPlay loop muted style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <source src="/blackhole.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-10 ">
        <div className="animate-fade-in text-center">
          <div className="mt-[-15rem] flex flex-col gap-6 mt-6 text-6xl font-bold text-white max-w-600px w-auto h-auto">
            <span>
              Real Time Chat App{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
                {" "}
                with a powerful Authentication{" "}
              </span>
              and Authorization.
            </span>
          </div>
        </div>
      </div>

  

      <div className="absolute bottom-0 left-0 right-0 text-center mb-[5rem] text-gray-400">
        <h1 className="text-4xl">
          Powered By <span className="text-white text-5xl">Paras Raut</span>
        </h1>
      </div>
    </div>
  );
}

export default Home;
