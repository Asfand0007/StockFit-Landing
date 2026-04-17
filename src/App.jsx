import { useState } from 'react';
import Home from './pages/Home';
import SplashScreen from './components/global/SplashScreen';

function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      {/* Splash screen shown once on first load */}
      {!splashDone && <SplashScreen onFinish={() => setSplashDone(true)} />}

      {/* Main app content — rendered underneath the splash */}
      <Home heroReady={splashDone} />
      <div className="min-h-screen w-full bg-[#fafafa]">
        <h1>Welcome to Stock Fit</h1>
        <p>Your ultimate stock market analysis tool.</p>
      </div>
      <div className="bg-yellow-300 h-screen">
        dasd
      </div>
      <div className="bg-yellow-300 h-screen">
        dasd
      </div>
    </>
  );
}

export default App;
