import React, { useEffect, useState } from "react";

const SplashScreen: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000); // 3000 ms = 3 seconds 

    
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div style={styles.splashContainer}>
        <h1 style={styles.welcomeText}>Welcome to cross talk</h1>
      </div>
    );
  }

  return (
    <div style={styles.appContainer}>
      <h1>lets get started</h1>
      {/* Place the rest of your app here */}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  splashContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#4CAF50", // Splash screen background color
    color: "white",
    fontFamily: "Arial, sans-serif",
    flexDirection: "column",
  },
  welcomeText: {
    fontSize: "32px",
    fontWeight: "bold",
  },
  appContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
};

export default SplashScreen;

