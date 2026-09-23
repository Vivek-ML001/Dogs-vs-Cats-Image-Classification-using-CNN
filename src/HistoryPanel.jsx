import React from 'react'
import './HistoryPanel.css'

export default function HistoryPanel({ history, onClear }) {
  if (history.length === 0) {
    return (
      <div className="history-panel">
        <div className="history-header">
          <h2 className="section-title">History</h2>
        </div>
        <div className="history-empty">
          <div className="history-empty-icon">📋</div>
          <p className="history-empty-text">
            Your classification history will appear here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="history-panel">
      <div className="history-header">
        <h2 className="section-title">History</h2>
        <button className="btn-clear" onClick={onClear}>
          Clear
        </button>
      </div>
      <div className="history-grid">
        {history.map((item, idx) => (
          <div key={idx} className="history-item">
            <div className="history-item-image">
              <img src={item.imageSrc} alt="Classification" />
              <div
                className="history-item-badge"
                style={{
                  background:
                    item.label === 'Cat'
                      ? 'var(--cat-color)'
                      : item.label === 'Dog'
                      ? 'var(--dog-color)'
                      : 'var(--text-muted)',
                }}
              >
                {item.label === 'Cat' ? '🐱' : item.label === 'Dog' ? '🐶' : '🤔'}
              </div>
            </div>
            <div className="history-item-info">
              <div className="history-item-label">{item.label}</div>
              <div className="history-item-confidence">
                {item.confidence > 0 ? `${item.confidence}%` : 'Uncertain'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
