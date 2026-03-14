import { useState, useEffect } from 'react'
import './App.css'
import { wordList } from './data/wordList'

function App() {
  const [learnedIds, setLearnedIds] = useState(() => {
    const saved = localStorage.getItem('learned_words');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // 未習得の単語リストを管理するstate
  const [unlearnedWords, setUnlearnedWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [isReady, setIsReady] = useState(false);
  // learnedIdsが変わるたびに未習得リストを更新
  useEffect(() => {
    const filtered = wordList.filter((_, i) => !learnedIds.includes(i));
    setUnlearnedWords(filtered);
    localStorage.setItem('learned_words', JSON.stringify(learnedIds));

    setIsReady(true);
  }, [learnedIds]);

  // 3. 【追加】Readyになるまでは何も表示しない（または真っ白な画面）
  if (!isReady) return null;

  const currentWord = unlearnedWords[index] || null;

  const handleCardClick = () => {
    if (currentWord) setIsFlipped(!isFlipped);
  }

  const handleNextButton = () => {
    setIsFlipped(false);
    if (unlearnedWords.length > 0) {
      setIndex((prev) => (prev + 1) % unlearnedWords.length);
    }
  };

  const markAsLearned = () => {
    if (!currentWord) return;
    const originalIndex = wordList.findIndex(w => w.de === currentWord.de);
    setLearnedIds([...learnedIds, originalIndex]);
    setIsFlipped(false);
    if (index >= unlearnedWords.length - 1) {
      setIndex(0);
    }
  };

  // シャッフル関数
  const shuffleWords = () => {
    if (unlearnedWords.length === 0) return;
    
    // 現在の未習得リストをシャッフル
    const shuffled = [...unlearnedWords].sort(() => Math.random() - 0.5);
    setUnlearnedWords(shuffled);
    
    // 状態をリセット
    setIndex(0); 
    setIsFlipped(false); // これで必ず「表（ドイツ語）」から始まる
  };

  // リセット機能
  const resetProgress = () => {
    if (window.confirm("学習記録をリセットして、最初からやり直しますか？")) {
      setLearnedIds([]);
      setIndex(0);
    }
  };

  return (
    <div className="h-screen bg-pink-50 flex flex-col items-center justify-start p-6 overflow-hidden select-none font-sans">
      
      <div className="mt-8 mb-10 text-center">
        <h1 className="title-container flex items-center justify-center gap-1">
          <span className="text-de">DE</span>
          <span className="text-tango">たんご</span>
        </h1>
        <div className="flex justify-center gap-1.5 mt-2">
          <div className="w-6 h-1 bg-black rounded-full"></div>
          <div className="w-6 h-1 bg-red-500 rounded-full"></div>
          <div className="w-6 h-1 bg-yellow-400 rounded-full"></div>
        </div>
      </div>

      {currentWord ? (
        <>
          {/* カード部分：ボタンを消してシンプルに */}
          <div className="card-container w-80 h-[400px] mb-10 cursor-pointer" onClick={handleCardClick}>
            <div className={`card-inner ${isFlipped ? 'is-flipped' : ''}`}>
              <div className="card-face bg-white border-4 border-orange-100 text-5xl font-bold text-orange-500 px-8 text-center">
                {currentWord.de}
              </div>
              <div className="card-face card-back bg-orange-400 text-5xl font-bold text-white px-8 text-center">
                {currentWord.jp}
              </div>
            </div>
          </div>

          {/* アクションエリア：ここにシャッフルを移動 */}
          <div className="flex flex-col items-center gap-6 w-full max-w-sm mt-auto mb-10">
            
            {/* シャッフルボタン：控えめだけど可愛いデザイン */}
            <button 
              onClick={shuffleWords}
              className="flex items-center gap-2 text-orange-400 bg-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm hover:bg-orange-50 active:scale-95 transition-all border border-orange-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              SHUFFLE
            </button>

            {/* 進捗ゲージ */}
            <div className="w-2/3 text-center -mt-2">
              <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-400 transition-all duration-300" 
                  style={{ width: `${(learnedIds.length / wordList.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-slate-500 text-[10px] mt-1.5 tracking-widest uppercase">
                {learnedIds.length} / {wordList.length} WORDS MASTERED
              </p>
            </div>

            <div className="flex gap-4 w-full px-4">
              {/* 「覚えた！」ボタン：もっと丸みを出して可愛く */}
              <button 
                onClick={markAsLearned}
                className="flex-[1.2] bg-orange-500 text-white py-4 rounded-full font-bold text-xl shadow-lg hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="text-2xl">✓</span> 覚えた！
              </button>

              {/* 「NEXT」ボタン */}
              <button
                onClick={handleNextButton}
                className="flex-1 bg-white border-2 border-orange-200 text-orange-500 py-4 rounded-full font-bold text-xl shadow-md hover:bg-orange-50 active:scale-95 transition-all"
              >
                NEXT →
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center mt-20 flex flex-col items-center gap-10">
          <p className="text-9xl">🎉</p>
          <p className="text-4xl font-bold text-orange-500">全コンプリート！</p>
          <p className="text-slate-600">素晴らしいドイツ語力です！</p>
          <button 
            onClick={resetProgress} 
            className="bg-white border border-slate-300 text-slate-500 px-8 py-3 rounded-full hover:bg-slate-50 transition-all"
          >
            学習記録をリセット
          </button>
        </div>
      )}
    </div>
  )
}

export default App