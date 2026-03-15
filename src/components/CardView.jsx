import React from 'react';

// 学習メイン画面（カード表示）コンポーネント
function CardView({ 
  currentWord, 
  isFlipped, 
  handleCardClick, 
  playAudio, 
  shuffleWords, 
  setIsListView, 
  learnedIds, 
  wordList, 
  markAsLearned, 
  handleNextButton 
}) {
  return (
    <>
      {/* カード部分：SE対策で上下の余白(my-4→my-2)を少し削る */}
      <div className="card-container w-80 cursor-pointer my-2" onClick={handleCardClick}>
        <div className={`card-inner ${isFlipped ? 'is-flipped' : ''}`}>
          <div className="card-face bg-white border-4 border-orange-100 text-4xl font-bold text-orange-500 px-8 text-center">
            {currentWord.de}
          </div>
          <div className="card-face card-back bg-orange-400 text-4xl font-bold text-white px-8 text-center">
            {currentWord.jp}
          </div>
        </div>
      </div>

      {/* アクションエリア：全体の隙間(gap-4→gap-2)を調整 */}
      <div className="flex flex-col items-center gap-2 w-full max-w-sm mb-4">
        
        {/* 【ここが修正ポイント】サブボタン行に再生ボタンをインライン化 */}
        <div className="flex gap-4 items-center justify-center w-full px-2">
          <button 
            onClick={shuffleWords}
            className="flex-1 max-w-[100px] text-orange-400 bg-white py-2 rounded-full text-[12px] font-bold shadow-sm border border-orange-100 active:scale-95 transition-all"
          >
            シャッフル
          </button>
          
          {/* 中央に配置したコンパクト再生ボタン */}
          <button 
            onClick={(e) => { e.stopPropagation(); playAudio(currentWord.de); }}
            className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all shrink-0"
            aria-label="音声再生"
          >
            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>

          <button 
            onClick={() => setIsListView(true)}
            className="flex-1 max-w-[100px] text-slate-400 bg-white py-2 rounded-full text-[12px] font-bold shadow-sm border border-slate-100 active:scale-95 transition-all"
          >
            リスト
          </button>
        </div>

        {/* 進捗ゲージ */}
        <div className="w-1/2 text-center mt-1">
          <div className="w-full h-1.5 bg-orange-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-400 transition-all duration-300" 
              style={{ width: `${(learnedIds.length / wordList.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-orange-400 mt-1 font-bold">{learnedIds.length} / {wordList.length}</p>
        </div>

        {/* メインボタン：ここもSE用に少しだけ高さを抑える(py-4→py-3.5) */}
        <div className="flex gap-3 w-full px-4 mt-1">
          <button 
            onClick={markAsLearned}
            className="flex-[1.2] bg-orange-500 text-white py-3.5 rounded-full font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            覚えた！
          </button>

          <button
            onClick={handleNextButton}
            className="flex-1 bg-white border-2 border-orange-200 text-orange-500 py-3.5 rounded-full font-bold text-lg shadow-md active:scale-95 transition-all"
          >
            NEXT
          </button>
        </div>
      </div>
    </>
  );
}

export default CardView;