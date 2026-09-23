import React, { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react'
import * as mobilenet from '@tensorflow-models/mobilenet'
import './Classifier.css'

const CAT_KEYWORDS = ['cat', 'tabby', 'kitten', 'egyptian cat', 'persian cat', 'siamese cat']
const DOG_KEYWORDS = ['dog', 'puppy', 'golden retriever', 'labrador', 'poodle', 'chihuahua', 'pug', 'beagle', 'collie', 'terrier', 'husky', 'malamute', 'corgi', 'dachshund', 'spaniel', 'schnauzer', 'mastiff', 'boxer', 'great pyrenees', 'afghan hound', 'basenji', 'bloodhound', 'blenheim spaniel', 'boston bull', 'bouvier des flandres', 'brabancon griffon', 'brittany spaniel', 'chesapeake bay retriever', 'curly-coated retriever', 'german shepherd', 'gordon setter', 'ibizan hound', 'irish setter', 'irish water spaniel', 'irish wolfhound', 'italian greyhound', 'japanese spaniel', 'keeshond', 'kelpie', 'komondor', 'kuvasz', 'leonberg', 'lhasa', 'malinois', 'mexican hairless', 'newfoundland', 'norwegian elkhound', 'otterhound', 'papillon', 'pekinese', 'pembroke', 'plott', 'pointer', 'pomeranian', 'rhodesian ridgeback', 'rottweiler', 'saint bernard', 'saluki', 'samoyed', 'scottish deerhound', 'sealyham terrier', 'shih-tzu', 'silky terrier', 'soft-coated wheaten terrier', 'standard poodle', 'standard schnauzer', 'sussex spaniel', 'tibetan mastiff', 'tibetan terrier', 'toy poodle', 'toy terrier', 'vizsla', 'welsh springer spaniel', 'west highland white terrier', 'whippet', 'wire-haired fox terrier', ' yorkie', 'yorkshire terrier', 'entlebucher', 'giant schnauzer', 'miniature poodle', 'miniature schnauzer', 'norfolk terrier', 'norwich terrier', 'old english sheepdog', 'otter hound', 'airedale']

const Classifier = forwardRef(function Classifier({ onResult }, ref) {
  const [model, setModel] = useState(null)
  const [modelLoading, setModelLoading] = useState(false)
  const [modelError, setModelError] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [predicting, setPredicting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const modelRef = useRef(null)

  const loadModel = useCallback(async () => {
    if (modelRef.current) return modelRef.current
    setModelLoading(true)
    setModelError(null)
    try {
      const loadedModel = await mobilenet.load({ version: 2, alpha: 1.0 })
      modelRef.current = loadedModel
      setModel(loadedModel)
      return loadedModel
    } catch (err) {
      setModelError('Failed to load the AI model. Please check your connection and try again.')
      throw err
    } finally {
      setModelLoading(false)
    }
  }, [])

  useImperativeHandle(ref, () => ({
    loadModel,
  }))

  useEffect(() => {
    loadModel().catch(() => {})
  }, [loadModel])

  const classifyImage = useCallback(
    async (imgElement) => {
      const activeModel = modelRef.current || (await loadModel())
      const rawPredictions = activeModel.classify(imgElement, 5)

      let catScore = 0
      let dogScore = 0

      for (const pred of rawPredictions) {
        const name = pred.className.toLowerCase()
        const isCat = CAT_KEYWORDS.some((kw) => name.includes(kw))
        const isDog = DOG_KEYWORDS.some((kw) => name.includes(kw))
        if (isCat) catScore += pred.probability
        if (isDog) dogScore += pred.probability
      }

      let label, confidence, catPercent, dogPercent

      if (catScore === 0 && dogScore === 0) {
        label = 'Uncertain'
        confidence = 0
        catPercent = 50
        dogPercent = 50
      } else {
        const total = catScore + dogScore
        catPercent = total > 0 ? (catScore / total) * 100 : 50
        dogPercent = total > 0 ? (dogScore / total) * 100 : 50
        label = catScore > dogScore ? 'Cat' : 'Dog'
        confidence = Math.max(catPercent, dogPercent)
      }

      return {
        label,
        confidence: Math.round(confidence * 10) / 10,
        catPercent: Math.round(catPercent * 10) / 10,
        dogPercent: Math.round(dogPercent * 10) / 10,
        rawPredictions: rawPredictions.slice(0, 3),
      }
    },
    [loadModel]
  )

  const handleFile = useCallback(
    async (file) => {
      if (!file || !file.type.startsWith('image/')) {
        setModelError('Please upload a valid image file (JPG, PNG, etc.)')
        return
      }

      setModelError(null)
      setPrediction(null)

      const reader = new FileReader()
      reader.onload = async (e) => {
        const src = e.target.result
        setImagePreview(src)

        setPredicting(true)
        try {
          await loadModel()
          const img = new Image()
          img.src = src
          img.onload = async () => {
            const result = await classifyImage(img)
            setPrediction(result)
            setPredicting(false)
            onResult({
              ...result,
              imageSrc: src,
              timestamp: Date.now(),
            })
          }
          img.onerror = () => {
            setModelError('Could not load that image. Please try a different file.')
            setPredicting(false)
          }
        } catch (err) {
          setModelError('Prediction failed. Please try again.')
          setPredicting(false)
        }
      }
      reader.onerror = () => {
        setModelError('Could not read that file. Please try again.')
      }
      reader.readAsDataURL(file)
    },
    [classifyImage, loadModel, onResult]
  )

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleReset = () => {
    setImagePreview(null)
    setPrediction(null)
    setModelError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="classifier">
      <div className="classifier-header">
        <h2 className="section-title">Classify an Image</h2>
        <p className="section-desc">
          Drag & drop or upload an image of a cat or dog. The AI will analyze it
          instantly.
        </p>
      </div>

      {modelError && (
        <div className="error-banner">
          <span className="error-icon">⚠</span>
          <span>{modelError}</span>
        </div>
      )}

      {!imagePreview && !modelLoading && !model && (
        <div
          className={`dropzone ${isDragging ? 'dropzone--active' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="dropzone-content">
            <div className="dropzone-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="dropzone-title">Drop an image here</p>
            <p className="dropzone-subtitle">or click to browse</p>
            <p className="dropzone-formats">JPG, PNG, WebP — up to 10MB</p>
          </div>
        </div>
      )}

      {modelLoading && (
        <div className="loading-state">
          <div className="spinner" />
          <p className="loading-text">Loading AI model…</p>
          <p className="loading-sub">First load downloads ~16MB, then it's cached.</p>
        </div>
      )}

      {imagePreview && (
        <div className="prediction-area">
          <div className="image-container">
            <img
              src={imagePreview}
              alt="Uploaded preview"
              className="preview-image"
            />
            <button className="btn-reset" onClick={handleReset} title="Upload a different image">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {predicting && (
            <div className="predicting-state">
              <div className="spinner spinner--small" />
              <p className="predicting-text">Analyzing image…</p>
            </div>
          )}

          {prediction && !predicting && (
            <div className={`result-card result-card--${prediction.label.toLowerCase()}`}>
              <div className="result-header">
                <div className="result-emoji">
                  {prediction.label === 'Cat' ? '🐱' : prediction.label === 'Dog' ? '🐶' : '🤔'}
                </div>
                <div className="result-info">
                  <div className="result-label">{prediction.label}</div>
                  <div className="result-confidence">
                    {prediction.confidence > 0
                      ? `${prediction.confidence}% confidence`
                      : 'Not a clear cat or dog'}
                  </div>
                </div>
                <div
                  className="result-badge"
                  style={{
                    background:
                      prediction.label === 'Cat'
                        ? 'var(--cat-color)'
                        : prediction.label === 'Dog'
                        ? 'var(--dog-color)'
                        : 'var(--text-muted)',
                  }}
                >
                  {prediction.confidence > 70
                    ? 'High'
                    : prediction.confidence > 40
                    ? 'Medium'
                    : 'Low'}
                </div>
              </div>

              <div className="confidence-bars">
                <div className="confidence-bar-group">
                  <div className="confidence-bar-label">
                    <span>🐱 Cat</span>
                    <span>{prediction.catPercent}%</span>
                  </div>
                  <div className="confidence-bar-track">
                    <div
                      className="confidence-bar-fill confidence-bar-fill--cat"
                      style={{ width: `${prediction.catPercent}%` }}
                    />
                  </div>
                </div>
                <div className="confidence-bar-group">
                  <div className="confidence-bar-label">
                    <span>🐶 Dog</span>
                    <span>{prediction.dogPercent}%</span>
                  </div>
                  <div className="confidence-bar-track">
                    <div
                      className="confidence-bar-fill confidence-bar-fill--dog"
                      style={{ width: `${prediction.dogPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {prediction.rawPredictions && prediction.rawPredictions.length > 0 && (
                <div className="raw-predictions">
                  <div className="raw-predictions-title">Top AI detections:</div>
                  <div className="raw-prediction-tags">
                    {prediction.rawPredictions.map((p, i) => (
                      <span key={i} className="raw-tag">
                        {p.className.split(',')[0].trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!imagePreview && !modelLoading && model && (
        <div
          className={`dropzone ${isDragging ? 'dropzone--active' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="dropzone-content">
            <div className="dropzone-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="dropzone-title">Drop an image here</p>
            <p className="dropzone-subtitle">or click to browse</p>
            <p className="dropzone-formats">JPG, PNG, WebP — up to 10MB</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />
    </div>
  )
})

export default Classifier
