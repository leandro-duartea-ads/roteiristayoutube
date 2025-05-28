
import React, { useState, useCallback } from 'react';
import { generateScript } from './services/geminiService';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ScriptIcon, ClipboardIcon, CheckIcon, SparklesIcon, ErrorIcon } from './components/Icons';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [videoStyle, setVideoStyle] = useState<string>('informativo');
  const [duration, setDuration] = useState<string>('curto');
  const [script, setScript] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleGenerateScript = useCallback(async () => {
    if (!topic.trim()) {
      setError('Por favor, insira um tópico para o vídeo.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setScript(null);
    try {
      const generatedScript = await generateScript(topic, videoStyle, duration);
      setScript(generatedScript);
    } catch (err) {
      console.error(err);
      setError('Falha ao gerar o roteiro. Verifique sua chave de API e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [topic, videoStyle, duration]);

  const handleCopyToClipboard = useCallback(() => {
    if (script) {
      navigator.clipboard.writeText(script)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(err => {
          console.error('Falha ao copiar o roteiro: ', err);
          setError('Falha ao copiar o roteiro.');
        });
    }
  }, [script]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 selection:bg-sky-500 selection:text-white">
      <div className="bg-slate-800 shadow-2xl rounded-xl p-6 md:p-10 w-full max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-sky-600 p-3 rounded-full mb-4 shadow-lg">
            <ScriptIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-sky-400">Roteirista IA para YouTube</h1>
          <p className="text-slate-400 mt-2 text-lg">
            Crie roteiros incríveis para seus vídeos sem rosto com o poder da IA.
          </p>
        </header>

        <main>
          <div className="space-y-6">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-sky-300 mb-1">
                Tópico do Vídeo
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Os 5 melhores destinos de viagem na América do Sul"
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder-slate-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="videoStyle" className="block text-sm font-medium text-sky-300 mb-1">
                  Estilo do Vídeo
                </label>
                <select
                  id="videoStyle"
                  value={videoStyle}
                  onChange={(e) => setVideoStyle(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none appearance-none transition-colors"
                >
                  <option value="informativo">Informativo</option>
                  <option value="educacional">Educacional</option>
                  <option value="entretenimento">Entretenimento</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="storytelling">Storytelling</option>
                </select>
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-sky-300 mb-1">
                  Duração Estimada
                </label>
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none appearance-none transition-colors"
                >
                  <option value="curto">Curto (2-4 min)</option>
                  <option value="medio">Médio (5-8 min)</option>
                  <option value="longo">Longo (10+ min)</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={handleGenerateScript}
              disabled={isLoading}
              className="w-full flex items-center justify-center p-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-md transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner className="w-5 h-5 mr-2" />
                  Gerando Roteiro...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Gerar Roteiro
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-900/30 border border-red-700 text-red-300 rounded-md flex items-center">
              <ErrorIcon className="w-6 h-6 mr-3 text-red-400" />
              <p>{error}</p>
            </div>
          )}

          {script && (
            <div className="mt-8 p-6 bg-slate-700/50 border border-slate-600 rounded-md shadow-inner">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-sky-400">Roteiro Gerado</h2>
                <button
                  onClick={handleCopyToClipboard}
                  className="flex items-center px-4 py-2 bg-slate-600 hover:bg-slate-500 text-sky-300 rounded-md transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-700 text-sm"
                  title="Copiar Roteiro"
                >
                  {isCopied ? <CheckIcon className="w-5 h-5 mr-2 text-green-400" /> : <ClipboardIcon className="w-5 h-5 mr-2" />}
                  {isCopied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              <div className="prose prose-invert prose-sm md:prose-base max-w-none whitespace-pre-wrap break-words selection:bg-sky-500 selection:text-white">
                {script}
              </div>
            </div>
          )}
        </main>
        
        <footer className="text-center mt-10 text-sm text-slate-500">
          <p>Desenvolvido com React, Tailwind CSS e Gemini API.</p>
          <p>Lembre-se de revisar e adaptar o roteiro gerado para seu estilo único!</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
