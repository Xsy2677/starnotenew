import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Intro from './components/Intro';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Archive from './pages/Archive';
import Breathing from './pages/Breathing';
import Drawing from './pages/Drawing';
import Sound from './pages/Sound';
import StarsCommunity from './pages/StarsCommunity';
import About from './pages/About';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro) return <Intro onEnter={() => setShowIntro(false)} />;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/relax/breathing" element={<Breathing />} />
          <Route path="/relax/draw" element={<Drawing />} />
          <Route path="/relax/sound" element={<Sound />} />
          <Route path="/stars" element={<StarsCommunity />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}