import { useState } from 'react'
import './App.css'
import { wordList } from './data/wordList'

function App() {
  const [index, setIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  // カードクリック：裏表を切り替える
  const handleCardClick = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNextButton = () => {
    // 1. 裏表の状態に関わらず、即座に「表向き」にリセットし、単語を次に進める
    // 同時に実行することで、ブラウザの描画タイミングによっては「戻る動き」をスキップできます
    setIsFlipped(false);
    setIndex((prev) => (prev + 1) % wordList.length);
  };

  return (
    // 可愛いピンク背景 (bg-pink-50)
    <div className="h-screen bg-pink-50 flex flex-col items-center justify-center p-6 overflow-hidden select-none font-sans">
      
      {/* 【修正】もっと可愛く、場所も最適化したロゴ */}
      <div className="mb-10 text-center mt-[-40px]"> {/* 少し上にマージンを詰める */}
        <h1 className="cute-logo text-7xl font-bold inline-block relative">
          DEたんご
          {/* 可愛いアンダーラインの装飾 */}
          <span className="absolute bottom-[-10px] left-0 w-full h-2 bg-orange-200 rounded-full opacity-60"></span>
        </h1>
        <p className="text-slate-400 text-sm mt-2 tracking-widest uppercase">German Flashcards</p>
      </div>

      {/* カード部分（CSSクラスを指定） */}
      <div className="card-container w-80 h-[420px] mb-12 cursor-pointer" onClick={handleCardClick}>
        <div className={`card-inner ${isFlipped ? 'is-flipped' : ''}`}>
          
          {/* 表：ドイツ語 (白地にオレンジの枠線) */}
          <div className="card-face bg-white border-4 border-orange-100 text-5xl font-bold text-orange-500 px-8 text-center transition-colors">
            {wordList[index].de}
          </div>

          {/* 裏：日本語 (オレンジ背景に白文字) */}
          <div className="card-face card-back bg-orange-400 text-5xl font-bold text-white px-8 text-center">
            {wordList[index].jp}
          </div>

        </div>
      </div>

      {/* 可愛い「次へ」ボタン (orange-500) */}
      <button
        onClick={handleNextButton}
        className="fixed bottom-10 bg-orange-500 hover:bg-orange-600 text-white px-16 py-5 rounded-full font-bold text-2xl shadow-lg active:scale-90 transition-all active:bg-orange-700"
      >
        NEXT →
      </button>
    </div>
  )
}

export default App
