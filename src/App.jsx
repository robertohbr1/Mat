import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Brain, Star, Zap } from 'lucide-react';
import './index.css';

// Utility to generate a random number between min and max (inclusive)
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateProblem = (level) => {
  let num1, num2, operator, answer;
  let ops = [];

  if (level === 1) {
    ops = ['+', '-'];
    operator = ops[randomInt(0, ops.length - 1)];
    if (operator === '+') {
      num1 = randomInt(1, 10);
      num2 = randomInt(1, 10);
      answer = num1 + num2;
    } else {
      num1 = randomInt(1, 10);
      num2 = randomInt(1, num1); // avoid negative answers
      answer = num1 - num2;
    }
  } else if (level === 2) {
    ops = ['+', '-'];
    operator = ops[randomInt(0, ops.length - 1)];
    if (operator === '+') {
      num1 = randomInt(10, 50);
      num2 = randomInt(10, 50);
      answer = num1 + num2;
    } else {
      num1 = randomInt(20, 50);
      num2 = randomInt(1, num1);
      answer = num1 - num2;
    }
  } else if (level === 3) {
    ops = ['+', '-', '*'];
    operator = ops[randomInt(0, ops.length - 1)];
    if (operator === '+') {
      num1 = randomInt(20, 100);
      num2 = randomInt(20, 100);
      answer = num1 + num2;
    } else if (operator === '-') {
      num1 = randomInt(30, 100);
      num2 = randomInt(1, num1);
      answer = num1 - num2;
    } else if (operator === '*') {
      num1 = randomInt(2, 5);
      num2 = randomInt(2, 9);
      answer = num1 * num2;
    }
  } else if (level === 4) {
    ops = ['+', '-', '*', '/'];
    operator = ops[randomInt(0, ops.length - 1)];
    if (operator === '+') {
      num1 = randomInt(50, 200);
      num2 = randomInt(50, 200);
      answer = num1 + num2;
    } else if (operator === '-') {
      num1 = randomInt(50, 200);
      num2 = randomInt(1, num1);
      answer = num1 - num2;
    } else if (operator === '*') {
      num1 = randomInt(2, 10);
      num2 = randomInt(2, 10);
      answer = num1 * num2;
    } else if (operator === '/') {
      num2 = randomInt(2, 10);
      answer = randomInt(2, 10);
      num1 = num2 * answer; // ensures exact division
    }
  } else {
    // Level 5+
    ops = ['+', '-', '*', '/'];
    operator = ops[randomInt(0, ops.length - 1)];
    const mult = level - 4; // Increases difficulty indefinitely
    
    if (operator === '+') {
      num1 = randomInt(100 * mult, 500 * mult);
      num2 = randomInt(100 * mult, 500 * mult);
      answer = num1 + num2;
    } else if (operator === '-') {
      num1 = randomInt(200 * mult, 600 * mult);
      num2 = randomInt(1, num1);
      answer = num1 - num2;
    } else if (operator === '*') {
      num1 = randomInt(2 + mult, 12 + mult);
      num2 = randomInt(2 + mult, 12 + mult);
      answer = num1 * num2;
    } else if (operator === '/') {
      num2 = randomInt(2 + mult, 12 + mult);
      answer = randomInt(2 + mult, 15 + mult);
      num1 = num2 * answer;
    }
  }

  // Use special characters for display
  const displayOperator = operator === '*' ? '×' : operator === '/' ? '÷' : operator;

  return { num1, num2, operator, displayOperator, answer };
};

function App() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [problem, setProblem] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'correct', 'error'
  
  const inputRef = useRef(null);

  // Initialize first problem
  useEffect(() => {
    setProblem(generateProblem(level));
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
    });
  };

  const handleLevelUp = (newLevel) => {
    triggerConfetti();
    setLevel(newLevel);
    setStreak(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const parsedInput = parseInt(inputValue, 10);

    if (parsedInput === problem.answer) {
      // Correct Answer
      setStatus('correct');
      setScore(s => s + 10 * level);
      
      const newStreak = streak + 1;
      if (newStreak >= 5) {
        handleLevelUp(level + 1);
        setProblem(generateProblem(level + 1));
      } else {
        setStreak(newStreak);
        setProblem(generateProblem(level));
      }

      setTimeout(() => {
        setStatus('idle');
        setInputValue('');
        if (inputRef.current) inputRef.current.focus();
      }, 400);

    } else {
      // Wrong Answer
      setStatus('error');
      setStreak(0); // Reset streak
      
      setTimeout(() => {
        setStatus('idle');
        setInputValue('');
        if (inputRef.current) inputRef.current.focus();
      }, 500);
    }
  };

  const progressPercentage = (streak / 5) * 100;

  if (!problem) return null;

  return (
    <div className="slide-up">
      <div className={`glass-panel ${status === 'error' ? 'shake' : ''} ${status === 'correct' ? 'pop' : ''}`}>
        
        <div className="header">
          <div className="score-badge">
            <Star size={16} fill="currentColor" />
            {score} pts
          </div>
          <div className="level-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Brain size={16} />
            Nível {level}
          </div>
        </div>

        <div className="problem-container">
          <span>{problem.num1}</span>
          <span style={{ color: 'var(--primary)' }}>{problem.displayOperator}</span>
          <span>{problem.num2}</span>
          <span>=</span>
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="input-container">
            <input
              ref={inputRef}
              type="number"
              className={`answer-input ${status === 'error' ? 'error' : status === 'correct' ? 'success' : ''}`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="?"
              autoComplete="off"
            />
          </div>
          <p className="hint-text">Pressione Enter para responder</p>
        </form>

        <div style={{ width: '100%', marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
            <span>Progresso do Nível</span>
            <span>{streak} / 5</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
