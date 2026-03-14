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
    <div className="safe-container bg-pink-50 flex flex-col items-center justify-between p-4 overflow-hidden select-none font-sans">
      
      {/* ヘッダー：mtをさらに削って上部に詰める */}
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
        <>
          {/* カード：CSSで指定したクラスを使用 */}
          <div className="card-container w-80 cursor-pointer my-4" onClick={handleCardClick}>
            <div className={`card-inner ${isFlipped ? 'is-flipped' : ''}`}>
              <div className="card-face bg-white border-4 border-orange-100 text-4xl font-bold text-orange-500 px-8 text-center">
                {currentWord.de}
              </div>
              <div className="card-face card-back bg-orange-400 text-4xl font-bold text-white px-8 text-center">
                {currentWord.jp}
              </div>
            </div>
          </div>

          {/* アクションエリア：ここがSafariの最下部にぶつからないように調整 */}
          <div className="flex flex-col items-center gap-3 w-full max-w-sm mb-4">
            
            <button 
              onClick={shuffleWords}
              className="flex items-center gap-2 text-orange-400 bg-white px-4 py-1 rounded-full text-[10px] font-bold shadow-sm border border-orange-100 active:scale-95 transition-all"
            >
              SHUFFLE
            </button>

            {/* 進捗ゲージを少しコンパクトに */}
            <div className="w-1/2 text-center">
              <div className="w-full h-1 bg-orange-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-400 transition-all duration-300" 
                  style={{ width: `${(learnedIds.length / wordList.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* メインボタン：ここが一番大事 */}
            <div className="flex gap-3 w-full px-4 mb-2">
              <button 
                onClick={markAsLearned}
                className="flex-[1.2] bg-orange-500 text-white py-4 rounded-full font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                ✓ 覚えた！
              </button>

              <button
                onClick={handleNextButton}
                className="flex-1 bg-white border-2 border-orange-200 text-orange-500 py-4 rounded-full font-bold text-lg shadow-md active:scale-95 transition-all"
              >
                NEXT
              </button>
            </div>
          </div>
        </>
      ) : (
        /* コンプリート画面 */
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <p className="text-8xl">🎉</p>
          <p className="text-3xl font-bold text-orange-500">全コンプリート！</p>
          <button onClick={resetProgress} className="bg-white border border-slate-300 text-slate-500 px-8 py-3 rounded-full">
            リセット
          </button>
        </div>
      )}
    </div>
  )
}

export default App