import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PhotoGuestbook() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [enlargedId, setEnlargedId] = useState(null);
  const cameraInputRef = useRef(null);

  const imageWidth = 200;
  const imageHeight = 250;

  const randomVerticalPosition = () => {
    const maxY = window.innerHeight - imageHeight;
    return Math.random() * maxY;
  };

  const randomDirection = () => (Math.random() < 0.5 ? 'left' : 'right');
  const randomSpeed = () => Math.random() * 5 + 20;

  const handleAddEntry = (e) => {
    const file = e.target.files[0];
    const y = randomVerticalPosition();
    const direction = randomDirection();
    const duration = randomSpeed();

    const newEntry = {
      id: Date.now(),
      image: undefined,
      name: form.name || '방문자',
      message: form.message || '좋은 추억 남기고 갑니다!',
      date: new Date().toLocaleDateString(),
      y,
      direction,
      duration,
      enlarged: false,
    };

    if (!file) {
      setEntries((prev) => [...prev, newEntry]);
      setForm({ name: '', message: '' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      newEntry.image = reader.result;
      setEntries((prev) => [...prev, newEntry]);
      setForm({ name: '', message: '' });
    };
    reader.readAsDataURL(file);
  };

  const handleEnlarge = (id) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, enlarged: true } : entry
      )
    );
    setTimeout(() => {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, enlarged: false } : entry
        )
      );
    }, 10000);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-blue-200 to-cyan-300 flex items-center justify-center">
      <div className="z-50 bg-white bg-opacity-90 p-6 rounded-xl shadow-lg flex flex-col items-center gap-4 w-80">
        <img
          src="/한글로고(가로).png"
          alt="마크"
          className="w-24 h-auto mb-4"
        />
        <input
          type="text"
          placeholder="이름"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 mb-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="한마디"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full p-2 mb-4 border rounded-lg"
        />
        <div className="flex gap-4 w-full justify-center">
          <button
            onClick={() => cameraInputRef.current.click()}
            className="w-1/3 p-2 bg-green-500 text-white rounded-lg"
          >
            사진 찍기
          </button>
          <button
            onClick={() => handleAddEntry({ target: { files: [] } })}
            className="w-1/3 p-2 bg-gray-500 text-white rounded-lg"
          >
            사진 없이 등록
          </button>
        </div>
        <input
          type="file"
          accept="image/*"
          capture="user"
          ref={cameraInputRef}
          onChange={handleAddEntry}
          className="hidden"
        />
      </div>

      <AnimatePresence>
        {entries.map((entry) => {
          const startX =
            entry.direction === 'left' ? window.innerWidth + imageWidth : -imageWidth * 2;
          const endX =
            entry.direction === 'left' ? -imageWidth * 10 : window.innerWidth + imageWidth;

          return (
            <motion.div
              key={entry.id}
              className="absolute cursor-pointer"
              drag
              dragConstraints={{
                top: 0,
                left: 0,
                right: window.innerWidth,
                bottom: window.innerHeight,
              }}
              initial={{ x: startX, y: entry.y }}
              animate={{ x: [startX, endX], opacity: [1, 1, 0] }}
              transition={{
                duration: entry.duration,
                ease: 'linear',
                repeat: Infinity,
                times: [0, 0.9, 1],
              }}
              style={{
                width: `${imageWidth}px`,
                height: `${imageHeight}px`,
              }}
              onClick={() => handleEnlarge(entry.id)}
            >
              <div
                className="w-full h-full p-4 bg-white rounded-lg shadow-lg border-2 border-gray-400"
                style={{ position: 'relative' }}
              >
                {entry.image ? (
                  <img
                    src={entry.image}
                    alt="guest"
                    className="w-full h-full object-contain rounded-lg shadow-xl"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col justify-center text-center text-gray-700 text-sm">
                    <div className="text-lg font-semibold">{entry.name}</div>
                    <div>{entry.message}</div>
                    <div className="text-xs text-gray-500 mt-1">{entry.date}</div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                  {entry.name} - {entry.message} ({entry.date})
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
