import React, { useState } from 'react';

export default function QuestionBoard({ questionData, color, onBack }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [correctOption, setCorrectOption] = useState(null);
  
  // Lifeline states
  const [audienceVotes, setAudienceVotes] = useState(null);
  const [showAudience, setShowAudience] = useState(false);

  if (!questionData) {
    return (
      <div className="app-container glass" style={{ textAlign: 'center', '--cat-color': color }}>
        <h2 style={{color: 'white', marginBottom: '2rem'}}>No hay más preguntas en esta categoría.</h2>
        <button className="btn btn-primary" onClick={onBack}>Volver a Categorías</button>
      </div>
    );
  }

  const handleMarkCorrect = (label) => {
    setShowResult(true);
    setCorrectOption(label);
  };

  const handleAudienceLifeline = () => {
    if (audienceVotes) {
      setShowAudience(!showAudience);
      return;
    }
    
    // Simulate votes
    // We will generate 3 random numbers that sum to 100
    let a = Math.floor(Math.random() * 60) + 10; 
    let b = Math.floor(Math.random() * (90 - a)) + 5;
    let c = 100 - a - b;

    // Shuffle to not always have 'A' be a certain way, though math.random takes care of some of it.
    const votes = [
      { label: 'A', percent: a },
      { label: 'B', percent: b },
      { label: 'C', percent: c },
    ];
    // Shuffle the array of objects
    votes.sort(() => Math.random() - 0.5);
    
    const voteMap = {
      'A': votes[0].percent,
      'B': votes[1].percent,
      'C': votes[2].percent
    };
    
    setAudienceVotes(voteMap);
    setShowAudience(true);
  };

  return (
    <div className="app-container" style={{ '--cat-color': color }}>
      <div className="question-container">
        
        {/* Top bar with category and lifelines */}
        <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '800px', marginBottom: '1rem', alignItems: 'center'}}>
          <h2 style={{color: color, textTransform: 'uppercase', letterSpacing: '2px', margin: 0}}>
            {questionData.category}
          </h2>
          <button 
            className="btn" 
            style={{background: 'rgba(255,255,255,0.1)', color: 'white', border: `1px solid ${color}`}}
            onClick={handleAudienceLifeline}
          >
            👥 Comodín Público
          </button>
        </div>
        
        <div className="question-box glass">
          {questionData.question}
        </div>

        {/* Audience Graph Overlay (if active) */}
        {showAudience && audienceVotes && (
          <div className="audience-graph glass" style={{
            width: '100%', maxWidth: '800px', marginBottom: '2rem', padding: '1.5rem',
            background: 'rgba(0,0,0,0.8)', border: `2px solid ${color}`
          }}>
            <h3 style={{textAlign: 'center', marginBottom: '1rem', color: 'white'}}>Resultados del Público</h3>
            <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '150px'}}>
              {['A', 'B', 'C'].map(lbl => (
                <div key={lbl} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30%'}}>
                  <span style={{color: 'white', marginBottom: '0.5rem', fontWeight: 'bold'}}>{audienceVotes[lbl]}%</span>
                  <div style={{
                    width: '50px', 
                    height: `${audienceVotes[lbl]}%`, 
                    background: color,
                    transition: 'height 1s ease-out',
                    boxShadow: `0 0 10px ${color}`
                  }}></div>
                  <span style={{color: '#ccc', marginTop: '0.5rem', fontSize: '1.2rem', fontWeight: 'bold'}}>{lbl}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="options-grid">
          {questionData.options.map((opt) => {
            let className = "option-btn";
            if (showResult) {
               if (opt.label === correctOption) className += " correct";
               else if (opt.label === selectedOption && opt.label !== correctOption) className += " incorrect";
            } else if (selectedOption === opt.label) {
               className += " selected";
            }

            return (
              <div 
                key={opt.label} 
                className={className}
                onClick={() => {
                  if (!showResult) {
                    setSelectedOption(opt.label);
                  }
                }}
                onDoubleClick={() => handleMarkCorrect(opt.label)}
              >
                <span className="option-letter">{opt.label}:</span>
                <span className="option-text">{opt.text}</span>
                
                {selectedOption && !showResult && (
                  <button 
                    style={{marginLeft: 'auto', background: 'var(--correct)', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', color: 'white', cursor: 'pointer'}}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkCorrect(opt.label);
                    }}
                  >
                    ✓ Correcta
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="controls">
          <button className="btn" onClick={onBack}>Volver</button>
          <button className="btn btn-primary" onClick={() => {
            setSelectedOption(null);
            setShowResult(false);
            setCorrectOption(null);
            setAudienceVotes(null);
            setShowAudience(false);
            onBack(); 
          }}>Siguiente Pregunta</button>
        </div>
      </div>
    </div>
  );
}
