import { useState, useEffect, useRef, FormEvent } from "react";
import { Search, Music, Download, Play, Pause, X, Check, Volume2, SkipBack, SkipForward, Disc } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  thumbnail: string;
  url: string;
}

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSearch = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
      setResults(response.data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (track: Track) => {
    setIsDownloading(track.id);
    try {
      const downloadUrl = `/api/download-file?trackId=${track.id}&title=${encodeURIComponent(track.title)}`;
      
      // Crear un enlace oculto para disparar la descarga sin navegar la aplicación
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${track.title}.mp3`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setTimeout(() => setIsDownloading(null), 3000);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0A0A0B] text-[#E5E7EB] p-4 md:p-8 gap-4 md:gap-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
            <Music size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase">Download Music Kico</h1>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest leading-none">@NewMusic02_bot Official Bridge</p>
          </div>
        </div>
        <div className="glass px-4 py-2 rounded-full flex items-center gap-3 self-end sm:self-auto">
          <div className="bot-status-pulse"></div>
          <span className="text-[10px] sm:text-xs font-semibold text-emerald-400 uppercase">Conectado al Servidor</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-hidden min-h-0">
        {/* Sidebar Nav - Fixed simple links */}
        <aside className="hidden md:flex md:col-span-3 flex-col gap-4 overflow-hidden">
          <div className="glass rounded-2xl p-5 flex flex-col gap-6 flex-1 min-h-0">
            <nav className="space-y-4">
              <p className="text-[10px] font-bold text-gray-600 uppercase">Menú Principal</p>
              <div className="flex items-center gap-3 text-cyan-400 bg-cyan-500/10 p-2 rounded-lg cursor-pointer">
                <Search size={18} />
                <span className="text-sm font-medium">Buscador de MP3</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors p-2 cursor-pointer">
                <Download size={18} />
                <span className="text-sm font-medium">Mis Descargas</span>
              </div>
            </nav>
            <div className="mt-auto border-t border-white/5 pt-4 space-y-3">
              <p className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Acerca del Bot</p>
              <p className="text-[10px] text-gray-400 leading-relaxed italic">
                "Tu bot de música en Telegram: Escucha, descubre y disfruta tus canciones favoritas al instante."
              </p>
              <div className="text-[10px] text-gray-600">
                Versión estable. Sin publicidad.
              </div>
            </div>
          </div>
        </aside>

        {/* Content Section */}
        <section className="col-span-1 md:col-span-9 flex flex-col gap-4 overflow-hidden min-h-0">
          {/* Search Input */}
          <form onSubmit={handleSearch} className="relative flex items-center shrink-0">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca una canción o artista aquí..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-cyan-500/50 text-sm accent-glow placeholder:text-gray-600"
            />
          </form>

          {/* Results Area */}
          <div className="flex-1 overflow-hidden flex flex-col gap-3 min-h-0">
            <h2 className="text-xs font-semibold text-gray-400 mb-1 px-1 uppercase tracking-widest shrink-0">Resultados Encontrados</h2>
            
            <div className="flex-1 overflow-y-auto scrollbar-hide pr-1 space-y-3 pb-24 md:pb-8">
              {loading && (
                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                  <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-[10px] uppercase tracking-widest">Buscando...</p>
                </div>
              )}

              {!loading && results.map((track) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setSelectedTrack(track)}
                  className={`glass rounded-xl p-3 sm:p-4 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group ${
                    selectedTrack?.id === track.id ? "bg-white/10 border-cyan-500/30" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 overflow-hidden rounded-lg bg-gray-800 shrink-0">
                      <img src={track.thumbnail} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-white truncate">{track.title}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 truncate">{track.artist} • {track.duration}</p>
                    </div>
                  </div>
                  
                  <div className="ml-2">
                    {isDownloading === track.id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] text-cyan-400">...</span>
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDownload(track); }}
                        className="bg-cyan-500 hover:bg-cyan-400 text-black font-black py-2 px-3 sm:px-6 rounded-lg text-[10px] transition-colors whitespace-nowrap"
                      >
                        BAJAR
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {!loading && results.length === 0 && !query && (
                <div className="flex flex-col items-center justify-center py-20 opacity-20 text-center">
                  <Music size={40} className="mb-4" />
                  <p className="text-[10px] uppercase tracking-[0.2em]">Ingresa una búsqueda</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer Player - Simplified */}
      <footer className="glass rounded-2xl p-3 sm:p-4 flex items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-3 w-1/3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
            {selectedTrack ? (
              <img src={selectedTrack.thumbnail} className="w-full h-full object-cover" alt="" />
            ) : (
              <Music className="w-4 h-4 text-gray-400" />
            )}
          </div>
          <div className="hidden sm:block min-w-0">
            <p className="text-[10px] font-bold truncate leading-none mb-1">
              {selectedTrack ? selectedTrack.title : "Selección"}
            </p>
            <p className="text-[9px] text-gray-500 truncate leading-none">
              {selectedTrack ? selectedTrack.artist : "Ninguno"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 justify-center flex-1 text-gray-400">
          <button 
            onClick={() => {/* Lógica para canción anterior */}}
            className="hover:text-cyan-400 transition-colors hidden sm:block"
          >
            <SkipBack size={20} />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)} 
            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shrink-0"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
          </button>

          <button 
            onClick={() => {/* Lógica para canción siguiente */}}
            className="hover:text-cyan-400 transition-colors hidden sm:block"
          >
            <SkipForward size={20} />
          </button>
        </div>

        <div className="flex items-center justify-end w-1/3 gap-4">
          <div className="hidden md:flex items-center gap-2 text-gray-500 group">
            <Volume2 size={18} className="group-hover:text-cyan-400 transition-colors shrink-0" />
            <input 
              type="range" 
              className="w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-500"
              defaultValue="70"
            />
          </div>

          {selectedTrack && (
            <button 
              onClick={() => handleDownload(selectedTrack)}
              className="text-[#aaaaaa] hover:text-cyan-400 transition-colors shrink-0"
              title="Descargar"
            >
              <Download size={20} />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
