import { useState, useEffect } from 'react'
import './App.css'
import { wordList } from './data/wordList'
import ListView from './components/ListView'
import CardView from './components/CardView' // 新しくインポート

function App() {
  const [isListView, setIsListView] = useState(false);

  // 1. 習得済み単語のID保持
  const [learnedIds, setLearnedIds] = useState(() => {
    const saved = localStorage.getItem('learned_words');
    try { return saved ? JSON.parse(saved) : []; } catch (e) { return []; }
  });

  // 2. 学習用の並び順保持
  const [unlearnedIndices, setUnlearnedIndices] = useState(() => {
    const savedOrder = localStorage.getItem('current_order');
    if (savedOrder) {
      try { return JSON.parse(savedOrder); } catch (e) { return []; }
    }
    const savedLearned = localStorage.getItem('learned_words');
    const learned = savedLearned ? JSON.parse(savedLearned) : [];
    return wordList.map((_, i) => i).filter(i => !learned.includes(i));
  });

  // 3. 表示中のインデックス保持
  const [index, setIndex] = useState(() => {
    const savedIndex = localStorage.getItem('last_index');
    return savedIndex ? parseInt(savedIndex, 10) : 0;
  });

  const [isFlipped, setIsFlipped] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // 状態保存の副作用
  useEffect(() => {
    localStorage.setItem('learned_words', JSON.stringify(learnedIds));
    localStorage.setItem('current_order', JSON.stringify(unlearnedIndices));
    localStorage.setItem('last_index', index.toString());
  }, [learnedIds, unlearnedIndices, index]);

  useEffect(() => { setIsReady(true); }, []);

  const playAudio = (text) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const uttr = new SpeechSynthesisUtterance(text);
    uttr.lang = 'de-DE';
    uttr.rate = 0.9;
    window.speechSynthesis.speak(uttr);
  };

  if (!isReady) return null;

  const currentWordIndex = unlearnedIndices[index];
  const currentWord = currentWordIndex !== undefined ? wordList[currentWordIndex] : null;

  // --- ハンドラー系 ---
  const handleCardClick = () => { if (currentWord) setIsFlipped(!isFlipped); };

  // handleNextButton の下あたりに追加
  const handleNextButton = () => {
    setIsFlipped(false);
    if (unlearnedIndices.length > 0) {
      setIndex((prev) => (prev + 1) % unlearnedIndices.length);
    }
  };

  // 【追加】前の単語に戻る処理
  const handlePrevButton = () => {
    setIsFlipped(false);
    if (unlearnedIndices.length > 0) {
      setIndex((prev) => (prev - 1 + unlearnedIndices.length) % unlearnedIndices.length);
    }
  };

  const markAsLearned = () => {
    if (currentWordIndex === undefined) return;
    const newLearnedIds = [...learnedIds, currentWordIndex];
    setLearnedIds(newLearnedIds);
    const newIndices = unlearnedIndices.filter(i => i !== currentWordIndex);
    setUnlearnedIndices(newIndices);
    setIsFlipped(false);
    if (index >= newIndices.length) setIndex(0);
  };

  const shuffleWords = () => {
    if (unlearnedIndices.length === 0) return;
    const shuffled = [...unlearnedIndices].sort(() => Math.random() - 0.5);
    setUnlearnedIndices(shuffled);
    setIndex(0);
    setIsFlipped(false);
  };

  const toggleLearnedFromList = (id) => {
    if (learnedIds.includes(id)) {
      setLearnedIds(prev => prev.filter(item => item !== id));
      setUnlearnedIndices(prev => {
        const nextOrder = [...prev];
        nextOrder.splice(index + 1, 0, id);
        return nextOrder;
      });
    } else {
      setLearnedIds(prev => [...prev, id]);
      setUnlearnedIndices(prev => prev.filter(item => item !== id));
      if (index >= unlearnedIndices.length - 1) setIndex(0);
    }
  };

  const resetProgress = () => {
    if (window.confirm("学習記録をリセットしますか？")) {
      setLearnedIds([]);
      setUnlearnedIndices(wordList.map((_, i) => i));
      setIndex(0);
      localStorage.clear();
    }
  };

  // 一覧モード
  if (isListView) {
    return (
      <ListView 
        wordList={wordList} 
        learnedIds={learnedIds} 
        toggleLearned={toggleLearnedFromList}
        onClose={() => setIsListView(false)}
        playAudio={playAudio}
      />
    );
  }

  // メインモード
  return (
    <div className="safe-container bg-pink-50 flex flex-col items-center justify-between p-4 overflow-hidden select-none font-sans">
      <div className="mt-2 text-center">
        <h1 className="title-container flex items-center justify-center gap-1 scale-90 sm:scale-100">
          <span className="text-de">DE</span>
          <span className="text-tango">たんご</span>
        </h1>
        <div className="flex justify-center gap-1.5 mt-1">
          <div className="w-6 h-1 bg-black rounded-full"></div>
          <div className="w-6 h-1 bg-red-500 rounded-full"></div>
          <div className="w-6 h-1 bg-yellow-400 rounded-full"></div>
        </div>
      </div>

      {currentWord ? (
        <CardView 
          currentWord={currentWord}
          isFlipped={isFlipped}
          handleCardClick={handleCardClick}
          playAudio={playAudio}
          shuffleWords={shuffleWords}
          setIsListView={setIsListView}
          learnedIds={learnedIds}
          wordList={wordList}
          markAsLearned={markAsLearned}
          handleNextButton={handleNextButton}
          handlePrevButton={handlePrevButton}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <p className="text-8xl">🎉</p>
          <p className="text-3xl font-bold text-orange-500">全コンプリート！</p>
          <div className="flex gap-4">
            <button onClick={() => setIsListView(true)} className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold shadow-lg">一覧で復習</button>
            <button onClick={resetProgress} className="bg-white border border-slate-300 text-slate-500 px-8 py-3 rounded-full">リセット</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App