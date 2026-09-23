import React from 'react'
import './InfoSection.css'

export default function InfoSection() {
  return (
    <div className="info-section">
      <div className="info-header">
        <h2 className="section-title">About This Project</h2>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <div className="info-card-icon">🧠</div>
          <h3 className="info-card-title">How It Works</h3>
          <p className="info-card-text">
            The app uses MobileNet v2, a lightweight neural network pre-trained
            on ImageNet's 1,000 categories — including dozens of cat and dog
            breeds. When you upload an image, the model runs entirely in your
            browser via TensorFlow.js.
          </p>
        </div>

        <div className="info-card">
          <div className="info-card-icon">⚡</div>
          <h3 className="info-card-title">Fast & Private</h3>
          <p className="info-card-text">
            No image is ever sent to a server. Everything runs locally on your
            device, which means instant results after the model loads and
            complete privacy for your photos.
          </p>
        </div>

        <div className="info-card">
          <div className="info-card-icon">🔬</div>
          <h3 className="info-card-title">The Original CNN</h3>
          <p className="info-card-text">
            This web app is inspired by a deep learning project that trained a
            custom CNN on 20,000 cat and dog images, reaching ~85% validation
            accuracy. This demo uses a pre-trained model for instant browser
            inference without needing to train from scratch.
          </p>
        </div>
      </div>

      <div className="info-stats">
        <div className="info-stat">
          <div className="info-stat-value">1,000+</div>
          <div className="info-stat-label">Categories</div>
        </div>
        <div className="info-stat">
          <div className="info-stat-value">~16MB</div>
          <div className="info-stat-label">Model Size</div>
        </div>
        <div className="info-stat">
          <div className="info-stat-value">100%</div>
          <div className="info-stat-label">Client-side</div>
        </div>
        <div className="info-stat">
          <div className="info-stat-value">~85%</div>
          <div className="info-stat-label">Original CNN Accuracy</div>
        </div>
      </div>
    </div>
  )
}
