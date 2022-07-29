import { useEffect, useState } from "react";
import "./LoadingScreen.css";

function LoadingScreen({ visible }: { visible: boolean }) {
  const [textLoading, setTextLoading] = useState("Loading...");

  useEffect(() => {
    setInterval(() => {
      setTextLoading("Loading.");
      setTimeout(() => {
        setTextLoading("Loading..");
        setTimeout(() => {
          setTextLoading("Loading...");
        }, 500);
      }, 500);
    }, 1600);
  }, []);

  if (visible)
    return <div id="loading-screen"><span>{textLoading}</span></div>

  return null;
}

export default LoadingScreen;