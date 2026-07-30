import React, { useState, useEffect } from 'react';

const categories = [
  { id: 'historia', name: 'Historia', color: '#FFD700' }, // Gold
  { id: 'arte', name: 'Arte y Cultura', color: '#9b59b6' }, // Purple
  { id: 'ciencia', name: 'Ciencia y Naturaleza', color: '#2ecc71' }, // Green
  { id: 'geografia', name: 'Geografía', color: '#3498db' }, // Blue
  { id: 'deportes', name: 'Deportes', color: '#e67e22' }, // Orange
  { id: 'entretenimiento', name: 'Entretenimiento', color: '#ff6b81' } // Pink
];

export default function CategorySelector({ onSelectCategory }) {
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Sound placeholders if they ever add sounds
  const playTick = () => { /* placeholder */ };
  const playWin = () => { /* placeholder */ };

  const handleRandomSelect = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setHighlightedIndex(null);

    let currentIndex = 0;
    const spins = 30; // Total times it will jump
    let jumps = 0;

    const spinInterval = setInterval(() => {
      // Pick a random index that is different from current
      let nextIndex = Math.floor(Math.random() * categories.length);
      while(nextIndex === currentIndex && categories.length > 1) {
        nextIndex = Math.floor(Math.random() * categories.length);
      }
      currentIndex = nextIndex;
      setHighlightedIndex(currentIndex);
      playTick();

      jumps++;
      if (jumps >= spins) {
        clearInterval(spinInterval);
        playWin();
        // Wait 1.5s on the winning category before proceeding
        setTimeout(() => {
          const finalCat = categories[currentIndex];
          setIsSpinning(false);
          onSelectCategory(finalCat.name, finalCat.color);
        }, 1500);
      }
    }, 150); // Speed of the jump (150ms per jump)
  };

  return (
    <div className="app-container">
      <h1 className="title">Elige una Categoría</h1>
      
      <div style={{textAlign: 'center', marginBottom: '2rem'}}>
        <button 
          className={`btn btn-primary glass ${isSpinning ? 'disabled' : ''}`} 
          style={{fontSize: '1.2rem', padding: '1rem 2rem', '--cat-color': '#fff', color: 'black', background: 'var(--gold)', boxShadow: '0 0 15px var(--gold-glow)'}}
          onClick={handleRandomSelect}
          disabled={isSpinning}
        >
          🎲 Selección Aleatoria 🎲
        </button>
      </div>

      <div className="category-grid">
        {categories.map((cat, index) => {
          const isHighlighted = highlightedIndex === index;
          return (
            <div 
              key={cat.id} 
              className={`category-card glass ${isHighlighted ? 'roulette-highlight' : ''}`} 
              style={{ 
                '--cat-color': cat.color,
                opacity: (isSpinning && !isHighlighted) ? 0.5 : 1 // Dim others while spinning
              }}
              onClick={() => {
                if (!isSpinning) {
                  onSelectCategory(cat.name, cat.color);
                }
              }}
            >
              <h2 className="category-title">{cat.name}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}
