import React, { useState } from 'react';
import { QuizLevel, QuizQuestion } from '../types';
import { CheckCircle, XCircle, Trophy, RefreshCw } from 'lucide-react';

const quizData: QuizLevel[] = [
  {
    level: 'Beginner',
    questions: [
      { id: 1, question: "What is the unit of Force?", options: ["Joule", "Newton", "Watt", "Pascal"], correctAnswer: 1 },
      { id: 2, question: "Which particle has a negative charge?", options: ["Proton", "Neutron", "Electron", "Photon"], correctAnswer: 2 },
      { id: 3, question: "Speed is defined as:", options: ["Distance × Time", "Distance / Time", "Time / Distance", "Acceleration × Time"], correctAnswer: 1 },
    ]
  },
  {
    level: 'Intermediate',
    questions: [
      { id: 4, question: "What is the acceleration due to gravity on Earth?", options: ["9.8 m/s²", "10.5 m/s²", "8.9 m/s²", "9.1 m/s²"], correctAnswer: 0 },
      { id: 5, question: "Which law states F = ma?", options: ["Newton's 1st Law", "Newton's 2nd Law", "Newton's 3rd Law", "Hooke's Law"], correctAnswer: 1 },
      { id: 6, question: "In a circuit, if resistance increases while voltage stays constant, current will:", options: ["Increase", "Decrease", "Stay the same", "Become zero"], correctAnswer: 1 },
    ]
  },
  {
    level: 'Advanced',
    questions: [
      { id: 7, question: "What is the speed of light in a vacuum?", options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10⁵ km/h", "300 m/s"], correctAnswer: 0 },
      { id: 8, question: "Which of these is NOT a vector quantity?", options: ["Velocity", "Displacement", "Force", "Speed"], correctAnswer: 3 },
      { id: 9, question: "According to thermodynamics, entropy of an isolated system always:", options: ["Decreases", "Remains Constant", "Increases", "Fluctuates"], correctAnswer: 2 },
    ]
  }
];

const Quizzes: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuiz = quizData[activeLevel];

  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    if (showResults) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    let score = 0;
    currentQuiz.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) score++;
    });
    return score;
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Test Your Knowledge</h2>
        <div className="flex justify-center space-x-4 mt-6">
          {quizData.map((level, idx) => (
            <button
              key={level.level}
              onClick={() => { setActiveLevel(idx); resetQuiz(); }}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                activeLevel === idx
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700'
              }`}
            >
              {level.level}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {currentQuiz.questions.map((q, index) => {
          const isAnswered = answers[q.id] !== undefined;
          const isCorrect = answers[q.id] === q.correctAnswer;
          
          return (
            <div key={q.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h4 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
                <span className="text-indigo-500 mr-2">{index + 1}.</span> {q.question}
              </h4>
              <div className="space-y-3">
                {q.options.map((opt, optIdx) => {
                  let btnClass = "w-full text-left px-4 py-3 rounded-lg border transition-all ";
                  
                  if (showResults) {
                     if (optIdx === q.correctAnswer) btnClass += "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:text-green-300 ";
                     else if (answers[q.id] === optIdx) btnClass += "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:text-red-300 ";
                     else btnClass += "border-slate-200 dark:border-slate-700 opacity-50 ";
                  } else {
                     if (answers[q.id] === optIdx) btnClass += "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300 ";
                     else btnClass += "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-750 ";
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleOptionSelect(q.id, optIdx)}
                      disabled={showResults}
                      className={btnClass}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt}</span>
                        {showResults && optIdx === q.correctAnswer && <CheckCircle size={18} className="text-green-600" />}
                        {showResults && answers[q.id] === optIdx && optIdx !== q.correctAnswer && <XCircle size={18} className="text-red-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-center">
        {!showResults ? (
          <button
            onClick={() => setShowResults(true)}
            disabled={Object.keys(answers).length !== currentQuiz.questions.length}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-lg font-bold shadow-lg transition-colors"
          >
            Submit Answers
          </button>
        ) : (
          <div className="text-center animate-bounce-slow">
            <div className="inline-block p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mb-4">
               <Trophy size={40} className="text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              You scored {calculateScore()} / {currentQuiz.questions.length}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {calculateScore() === currentQuiz.questions.length ? "Perfect Score! You are a Physics Master!" : "Great effort! Keep practicing."}
            </p>
            <button
              onClick={resetQuiz}
              className="flex items-center mx-auto px-6 py-2 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 rounded-lg font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
            >
              <RefreshCw size={18} className="mr-2" /> Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;