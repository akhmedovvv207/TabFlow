import React, { useState } from 'react';
import { Search, X, Bookmark, Heart } from 'lucide-react';
import { Song, SongUserState, Language } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

interface SongsScreenProps {
  songs: Song[];
  songStates: Record<string, SongUserState>;
  lang: Language;
  onSelectSong: (song: Song) => void;
  onToggleFavorite: (songId: string) => void;
  onToggleOffline: (songId: string) => void;
}

export const SongsScreen: React.FC<SongsScreenProps> = ({
  songs,
  songStates,
  lang,
  onSelectSong,
  onToggleFavorite,
  onToggleOffline
}) => {
  const t = TRANSLATIONS[lang];
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'fav' | 'off'>('all');
  const [seeAllYours, setSeeAllYours] = useState(false);

  const getSongState = (id: string): SongUserState => {
    return songStates[id] || { fav: false, off: false, transpose: 0 };
  };

  const cleanQuery = query.trim().toLowerCase();
  const matchesSearch = (s: Song) => {
    if (!cleanQuery) return true;
    return (s.title + ' ' + s.artist).toLowerCase().includes(cleanQuery);
  };

  const matchesFilter = (s: Song) => {
    const st = getSongState(s.id);
    if (filter === 'fav') return st.fav;
    if (filter === 'off') return st.off;
    return true;
  };

  // Pre-filtered for search/filter mode
  const filteredSongs = songs.filter((s) => matchesSearch(s) && matchesFilter(s));

  // Partition for default browse mode
  const yourSongs = songs.filter((s) => getSongState(s.id).fav || s.id === 's-cold' || s.id === 's-scientist');
  const displayedYours = seeAllYours ? yourSongs : yourSongs.slice(0, 3);
  const popularSongs = songs.filter((s) => !displayedYours.some((y) => y.id === s.id)).sort((a, b) => b.plays - a.plays);

  // Album cover generator with warm artistic vinyl/geometry
  const renderCover = (s: Song) => {
    const h = s.hue;
    return (
      <div
        className="w-12 h-12 rounded-xl flex-shrink-0 relative overflow-hidden shadow-inner border border-black/10 flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, hsl(${h}, 65%, 45%), hsl(${h + 35}, 55%, 28%))`
        }}
      >
        <div
          className="absolute -left-2 -bottom-2 w-8 h-8 rounded-full opacity-70"
          style={{ background: `hsl(${h + 40}, 80%, 75%)` }}
        />
        <div
          className="absolute right-1 top-1 w-5 h-5 rounded-full opacity-60"
          style={{ background: `hsl(${h - 20}, 75%, 20%)` }}
        />
        <div className="relative z-10 w-3 h-3 rounded-full bg-[#fff0e4]/80 shadow-sm" />
      </div>
    );
  };

  const renderSongRow = (s: Song) => {
    const st = getSongState(s.id);
    return (
      <div
        key={s.id}
        onClick={() => onSelectSong(s)}
        className="group flex items-center gap-3.5 p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer"
        role="button"
        tabIndex={0}
      >
        {renderCover(s)}

        <div className="flex-1 min-w-0 flex flex-col">
          <span className="font-bold text-[15px] sm:text-base text-[var(--fg)] truncate">
            {s.title}
          </span>
          <span className="text-xs sm:text-[13px] font-medium text-[var(--muted)] truncate">
            {s.artist}
          </span>
        </div>

        {/* Action icons: Bookmark (offline) and Heart (favorite) */}
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onToggleOffline(s.id)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform active:scale-80 ${
              st.off ? 'text-[var(--chord)] bg-[var(--surface)]' : 'text-[var(--muted)]/70 hover:text-[var(--fg)]'
            }`}
            title={st.off ? t.tUnsaved : t.tSaved}
            aria-label={t.offline}
          >
            <Bookmark className="w-5 h-5" fill={st.off ? 'currentColor' : 'none'} strokeWidth={2.2} />
          </button>

          <button
            onClick={() => onToggleFavorite(s.id)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform active:scale-80 ${
              st.fav ? 'text-[var(--chord)] bg-[var(--surface)]' : 'text-[var(--muted)]/70 hover:text-[var(--fg)]'
            }`}
            title={st.fav ? t.tUnfav : t.tFav}
            aria-label={t.favs}
          >
            <Heart className="w-5 h-5" fill={st.fav ? 'currentColor' : 'none'} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg)]">
      {/* Top App Bar matching PDF Page 4 */}
      <header className="bg-[#7a2626] text-[#fff0e4] px-5 pt-4 pb-3 flex items-center justify-between shadow-sm shrink-0">
        <h1 className="font-display font-bold text-2xl tracking-tight">
          {t.songs}
        </h1>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-black/20 text-[#ffe8d6]">
          TabFlow
        </span>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24 no-scrollbar">
        {/* Search input field */}
        <div className="relative flex items-center bg-[var(--surface)] border border-[var(--line)] rounded-2xl px-3.5 h-12 shadow-sm focus-within:ring-2 focus-within:ring-[#7a2626]/40 transition-all">
          <Search className="w-5 h-5 text-[var(--muted)] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPh}
            className="flex-1 bg-transparent px-2.5 text-sm sm:text-[15px] font-semibold text-[var(--fg)] placeholder-[var(--muted)]/80 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-[var(--muted)] hover:text-[var(--fg)]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Chips Bar */}
        <div className="flex gap-2 mt-3 mb-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: t.all },
            { id: 'fav', label: t.favs },
            { id: 'off', label: t.offline }
          ].map((chip) => {
            const active = filter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setFilter(chip.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  active
                    ? 'bg-[#7a2626] text-[#fff0e4] border-[#7a2626] shadow-sm'
                    : 'bg-[var(--surface)] text-[var(--muted)] border-[var(--line)] hover:border-[#7a2626]/50'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Content list */}
        {cleanQuery || filter !== 'all' ? (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display font-bold text-lg text-[var(--fg)]">
                {t.results}
              </h2>
              <span className="text-xs font-bold text-[var(--muted)]">
                {filteredSongs.length}
              </span>
            </div>
            {filteredSongs.length > 0 ? (
              <div className="space-y-1">{filteredSongs.map(renderSongRow)}</div>
            ) : (
              <div className="py-12 text-center text-[var(--muted)]">
                <p className="font-bold text-sm">{t.nothing}</p>
                <p className="text-xs mt-1 max-w-xs mx-auto opacity-80">{t.nothingHint}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-3 space-y-5">
            {/* "Your songs" Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display font-bold text-lg sm:text-xl text-[var(--fg)]">
                  {t.yourSongs}
                </h2>
                {yourSongs.length > 3 && (
                  <button
                    onClick={() => setSeeAllYours(!seeAllYours)}
                    className="text-xs sm:text-sm font-bold text-[var(--chord)] hover:underline"
                  >
                    {seeAllYours ? t.collapse : t.seeAll}
                  </button>
                )}
              </div>

              {displayedYours.length > 0 ? (
                <div className="space-y-1">{displayedYours.map(renderSongRow)}</div>
              ) : (
                <div className="p-4 rounded-2xl bg-[var(--surface)] text-center text-xs text-[var(--muted)] font-medium">
                  {t.emptyYours}
                </div>
              )}
            </div>

            {/* "Popular songs" Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display font-bold text-lg sm:text-xl text-[var(--fg)]">
                  {t.popular}
                </h2>
              </div>
              <div className="space-y-1">{popularSongs.map(renderSongRow)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
