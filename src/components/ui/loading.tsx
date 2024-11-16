// src/components/ui/loading.tsx
import React from "react";
import ScaleLoader from "react-spinners/ScaleLoader";


export const LoadingScreen = () => (

  <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
    <ScaleLoader />
    {/* <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin">Loading...</div> */}
  </div>
);
