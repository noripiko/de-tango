import { useState } from 'react';

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
  handleNextButton,
  handlePrevButton 
}) {
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // --- スワイプ＆タップ制御 ---
  const onStart = (e) => {
    // ボタンのクリック時はスワイプ・タップを開始しない
    if (e.target.closest('button')) return;

    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    setStartPos({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const onMove = (e) => {
    if (!isDragging) return;
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    setDrag({ x: clientX - startPos.x, y: clientY - startPos.y });
  };

const onEnd = (e) => { // e を追加
    if (!isDragging) return;

    const absX = Math.abs(drag.x);
    const absY = Math.abs(drag.y);
    const threshold = 40; // 少し感度を上げました

    if (absX < 8 && absY < 8) {
      // ① タップ判定
      // preventDefaultでブラウザの余計な挙動を止める
      if (e.cancelable) e.preventDefault(); 
      handleCardClick(); 
    } else if (absX > threshold) {
      // ② 左右スワイプ
      if (drag.x > 0) handleNextButton();
      else handlePrevButton?.();
    }

    setIsDragging(false);
    setDrag({ x: 0, y: 0 });
  };

  const cardTransformStyle = {
    // 上への移動(drag.y * 0.4)は残しておくと、斜めに動かした時に少し浮いて可愛いです
    transform: `translate3d(${drag.x}px, ${drag.y * 0.4}px, 0) rotate(${drag.x * 0.05}deg)`,
    transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  };

  // 音声ボタンコンポーネント（カード内に配置用）
  const AudioButton = () => (
    <button 
      onClick={(e) => { 
        e.stopPropagation(); // めくる判定を防止
        playAudio(currentWord.de); 
      }}
      onMouseDown={(e) => e.stopPropagation()} // ドラッグ開始を防止
      onTouchStart={(e) => e.stopPropagation()}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all pointer-events-auto z-50"
      aria-label="音声再生"
    >
      <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </button>
  );

  return (
    <>
      {/* カードコンテナ */}
      <div 
        className="card-container w-80 h-[450px] my-4 touch-none select-none relative cursor-grab active:cursor-grabbing"
        onMouseDown={onStart}
        onMouseMove={onMove}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
      >
        <div style={cardTransformStyle} className="w-full h-full">
          <div className={`card-inner w-full h-full ${isFlipped ? 'is-flipped' : ''}`}>
            {/* 前面 */}
            <div className="card-face bg-white border-4 border-orange-100 text-4xl font-bold text-orange-500 px-8 text-center flex flex-col items-center justify-center shadow-xl rounded-3xl relative">
              <span className="mb-12">{currentWord.de}</span>
              <AudioButton />
            </div>
            {/* 背面 */}
            <div className="card-face card-back bg-orange-400 text-4xl font-bold text-white px-8 text-center flex flex-col items-center justify-center shadow-xl rounded-3xl relative">
              <span className="mb-12">{currentWord.jp}</span>
              <AudioButton />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-sm mb-4">
        {/* 覚えた！ボタン */}
        <div className="w-full px-4">
          <button 
            onClick={markAsLearned}
            className="w-full bg-orange-500 text-white py-4 rounded-full font-bold text-xl shadow-lg active:scale-95 transition-all"
          >
            覚えた！
          </button>
        </div>

        {/* 進捗ゲージ */}
        <div className="w-1/2 text-center">
          <div className="w-full h-1.5 bg-orange-200 rounded-full overflow-hidden">
            <div className="h-full bg-orange-400 transition-all duration-300" style={{ width: `${(learnedIds.length / wordList.length) * 100}%` }}></div>
          </div>
          <p className="text-[11px] text-orange-400 mt-1 font-bold">{learnedIds.length} / {wordList.length}</p>
        </div>

        {/* サブボタン */}
        <div className="flex gap-4 items-center justify-center w-full px-2">
          <button onClick={shuffleWords} className="flex-1 max-w-[120px] text-orange-400 bg-white py-2.5 rounded-full text-[14px] font-bold shadow-sm border border-orange-100 active:scale-95">
            シャッフル
          </button>
          <button onClick={() => setIsListView(true)} className="flex-1 max-w-[120px] text-slate-400 bg-white py-2.5 rounded-full text-[14px] font-bold shadow-sm border border-slate-100 active:scale-95">
            リスト
          </button>
        </div>
      </div>
    </>
  );
}

export default CardView;