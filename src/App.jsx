import React, { useState, useRef, useCallback, useEffect } from 'react'
import './App.css'
import Classifier from './Classifier.jsx'
import HistoryPanel from './HistoryPanel.jsx'
import InfoSection from './InfoSection.jsx'

export default function App() {
  const [history, setHistory] = useState([])
  const classifierRef = useRef(null)

  const handleResult = useCallback((result) => {
    setHistory((prev) => [result, ...prev].slice(0, 12))
  }, [])

  const handleClearHistory = useCallback(() => {
    setHistory([])
  }, [])

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-logo">
          <span className="nav-icon">🐾</span>
          <span className="nav-title">CatDog AI</span>
        </div>
        <div className="nav-links">
          <a href="#classifier" className="nav-link">Classify</a>
          <a href="#history" className="nav-link">History</a>
          <a href="#about" className="nav-link">About</a>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-badge">Powered by TensorFlow.js & MobileNet</div>
        <h1 className="hero-title">
          Cats vs Dogs <span className="hero-accent">Classifier</span>
        </h1>
        <p className="hero-subtitle">
          Upload any image and our AI will tell you if it's a cat or a dog —
          right in your browser, no server needed.
        </p>
      </header>

      <main className="main-content">
        <section id="classifier" className="section">
          <Classifier ref={classifierRef} onResult={handleResult} />
        </section>

        <section id="history" className="section">
          <HistoryPanel history={history} onClear={handleClearHistory} />
        </section>

        <section id="about" className="section">
          <InfoSection />
        </section>
      </main>

      <footer className="footer">
        <p>
          Built with TensorFlow.js & MobileNet — inference runs entirely in your
          browser. Inspired by the CNN project by Vivek Kumar.
        </p>
      </footer>
    </div>
  )
}
