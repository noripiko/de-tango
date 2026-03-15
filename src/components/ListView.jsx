import React, { useState } from 'react';

function ListView({ wordList, learnedIds, toggleLearned, onClose, playAudio }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWords = wordList.map((word, originalIndex) => ({ ...word, originalIndex }))
    .filter(word => 
      word.de.toLowerCase().includes(searchQuery.toLowerCase()) || 
      word.jp.includes(searchQuery)
    );

  return (
    <div className="safe-container bg-white flex flex-col h-screen font-sans overflow-hidden">
      {/* ヘッダー */}
      <div className="pt-4 px-4 pb-2 border-b border-orange-100 bg-orange-50/50">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-orange-600">
            単語リスト<span className="text-sm font-normal ml-1">({learnedIds.length}/{wordList.length})</span>
          </h2>
          <button 
            onClick={onClose} 
            className="bg-orange-500 text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-md active:scale-95 transition-all"
          >
            閉じる
          </button>
        </div>

        {/* 検索入力欄 */}
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="単語を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-orange-200 rounded-xl px-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-300 transition-all"
          />
          {/* 虫眼鏡アイコンをSVGにして絵文字感を排除 */}
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2 text-slate-300 hover:text-slate-500 font-bold p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* リスト部分 */}
      <div className="flex-1 overflow-y-auto pb-10">
        {filteredWords.length > 0 ? (
          filteredWords.map((word) => {
            const isLearned = learnedIds.includes(word.originalIndex);
            return (
              <div 
                key={word.originalIndex} 
                className="flex items-center gap-4 p-4 border-b border-gray-50 active:bg-orange-50/30 transition-colors"
              >
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={isLearned} 
                    onChange={() => toggleLearned(word.originalIndex)}
                    className="w-6 h-6 appearance-none border-2 border-orange-200 rounded checked:bg-orange-500 checked:border-orange-500 transition-all cursor-pointer"
                  />
                  {isLearned && (
                    <span className="absolute inset-0 flex items-center justify-center text-white pointer-events-none text-[10px]">✓</span>
                  )}
                </div>
                
                <div 
                  className={`flex-1 transition-opacity duration-300 ${isLearned ? 'opacity-30' : 'opacity-100'}`}
                  onClick={() => playAudio(word.de)}
                >
                  <p className="text-lg font-bold text-slate-800 leading-tight">{word.de}</p>
                  <p className="text-sm text-slate-400">{word.jp}</p>
                </div>

                <button 
                  onClick={() => playAudio(word.de)} 
                  className="w-10 h-10 bg-white border border-orange-100 text-orange-400 rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-all shrink-0"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
            );
          })
        ) : (
          <div className="p-10 text-center text-slate-300 text-sm">
            該当する単語がありません
          </div>
        )}
      </div>
    </div>
  );
}

export default ListView;