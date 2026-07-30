import React, { useState, useEffect } from 'react';
import CategorySelector from './components/CategorySelector';
import QuestionBoard from './components/QuestionBoard';
import questionsData from './data/questions.json';

function App() {
  const [currentView, setCurrentView] = useState('start'); // 'start', 'categories', 'question'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#fff');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  
  // Track asked questions to not repeat them
  const [askedQuestions, setAskedQuestions] = useState([]);

  const handleStart = () => setCurrentView('categories');

  const handleSelectCategory = (categoryName, color) => {
    setSelectedCategory(categoryName);
    setSelectedColor(color);
    
    // Find a random question in this category that hasn't been asked
    const categoryQuestions = questionsData.filter(q => q.category === categoryName);
    const availableQuestions = categoryQuestions.filter(q => !askedQuestions.includes(q.id));
    
    if (availableQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const question = availableQuestions[randomIndex];
      setCurrentQuestion(question);
      setAskedQuestions(prev => [...prev, question.id]);
    } else {
      setCurrentQuestion(null); // No more questions
    }
    
    setCurrentView('question');
  };

  const handleBackToCategories = () => {
    setCurrentView('categories');
  };

  return (
    <>
      {currentView === 'start' && (
        <div className="app-container" style={{alignItems: 'center'}}>
          <h1 className="title" style={{fontSize: '4rem', marginBottom: '1rem'}}>¿Quién Quiere Ser<br/>Millonario?</h1>
          <p style={{fontSize: '1.2rem', color: '#ccc', marginBottom: '3rem', textAlign: 'center'}}>
            Edición Premium
          </p>
          <button 
            className="btn btn-primary glass" 
            style={{fontSize: '1.5rem', padding: '1rem 3rem', '--cat-color': '#FFD700'}}
            onClick={handleStart}
          >
            Comenzar Juego
          </button>
        </div>
      )}

      {currentView === 'categories' && (
        <CategorySelector onSelectCategory={handleSelectCategory} />
      )}

      {currentView === 'question' && (
        <QuestionBoard 
          questionData={currentQuestion} 
          color={selectedColor} 
          onBack={handleBackToCategories} 
        />
      )}
    </>
  );
}

export default App;
