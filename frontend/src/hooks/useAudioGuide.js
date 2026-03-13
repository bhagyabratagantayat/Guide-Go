import { useState, useCallback, useEffect } from 'react';

const useAudioGuide = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState('');

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentText('');
    }
  }, []);

  const speak = useCallback((text) => {
    if (!text) return;
    
    if ('speechSynthesis' in window) {
      // Cancel previous
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.onstart = () => {
        setIsPlaying(true);
        setCurrentText(text);
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentText('');
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
        setCurrentText('');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported');
    }
  }, []);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { isPlaying, currentText, speak, stop };
};

export default useAudioGuide;
