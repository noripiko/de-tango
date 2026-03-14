import { useState, useEffect } from 'react'
import './App.css'
import { wordList } from './data/wordList'

function App() {
  // 1. 習得済み単語のID（インデックス）を保持
  const [learnedIds, setLearnedIds] = useState(() => {
    const saved = localStorage.getItem('learned_words');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // 2. 「まだ覚えていない単語の番号」だけのリスト（これが3000個あっても爆速の秘密）
  const [unlearnedIndices, setUnlearnedIndices] = useState([]);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // 初回起動時に「まだ覚えていない番号」を一度だけ抽出
  useEffect(() => {
    const indices = wordList
      .map((_, i) => i)
      .filter(i => !learnedIds.includes(i));
    setUnlearnedIndices(indices);
    setIsReady(true);
  }, []);

  // ロード中は何もしない
  if (!isReady) return null;

  // 現在表示すべき単語（番号から実体を取得）
  const currentWordIndex = unlearnedIndices[index];
  const currentWord = currentWordIndex !== undefined ? wordList[currentWordIndex] : null;

  // --- ハンドラー系 ---

  // カードをめくる
  const handleCardClick = () => {
    if (currentWord) setIsFlipped(!isFlipped);
  };

  // 次へ（高速連打の肝）
  const handleNextButton = () => {
    setIsFlipped(false);
    if (unlearnedIndices.length > 0) {
      setIndex((prev) => (prev + 1) % unlearnedIndices.length);
    }
  };

  // 覚えた！
  const markAsLearned = () => {
    if (currentWordIndex === undefined) return;

    // 習得済みIDリストを更新して保存
    const newLearnedIds = [...learnedIds, currentWordIndex];
    setLearnedIds(newLearnedIds);
    localStorage.setItem('learned_words', JSON.stringify(newLearnedIds));

    // 今のノック用リストからこの単語を消す
    const newIndices = unlearnedIndices.filter(i => i !== currentWordIndex);
    setUnlearnedIndices(newIndices);

    setIsFlipped(false);
    
    // 最後の単語だったら0番目に戻す
    if (index >= newIndices.length) {
      setIndex(0);
    }
  };

  // シャッフル（番号の配列を混ぜるだけなので3000個でも一瞬）
  const shuffleWords = () => {
    if (unlearnedIndices.length === 0) return;
    const shuffled = [...unlearnedIndices].sort(() => Math.random() - 0.5);
    setUnlearnedIndices(shuffled);
    setIndex(0);
    setIsFlipped(false);
  };

  // 進捗リセット
  const resetProgress = () => {
    if (window.confirm("学習記録をリセットして、最初からやり直しますか？")) {
      setLearnedIds([]);
      setUnlearnedIndices(wordList.map((_, i) => i)); // 全番号を復活
      setIndex(0);
      localStorage.removeItem('learned_words');
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