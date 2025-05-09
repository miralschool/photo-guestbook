import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function PhotoGuestbook() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', message: '' });
  const [enlargedId, setEnlargedId] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const imageWidth = 192;
  const imageHeight = 256;

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
      enlarged: false
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
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-200">
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white bg-opacity-90 p-4 rounded-xl shadow-lg flex flex-col items-center gap-2">
        <img src="/한글로고(가로).png" alt="마크" className="w-32 h-auto mb-2" />
        <input
          type="text"
          placeholder="이름"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-64 p-1 border rounded"
        />
        <input
          type="text"
          placeholder="한마디"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-64 p-1 border rounded"
        />
        <div className="flex gap-2">
          <Button onClick={() => fileInputRef.current.click()}>사진 업로드</Button>
          <Button onClick={() => cameraInputRef.current.click()}>사진 찍기</Button>
          <Button onClick={() => handleAddEntry({ target: { files: [] } })}>사진 없이 등록</Button>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleAddEntry}
          className="hidden"
        />
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={cameraInputRef}
          onChange={handleAddEntry}
          className="hidden"
        />
      </div>

      <AnimatePresence>
        {entries.map((entry) => {
          const startX = entry.direction === 'left' ? window.innerWidth + imageWidth : -imageWidth * 2;
          const endX = entry.direction === 'left' ? -imageWidth * 10 : window.innerWidth + imageWidth;

          return (
            <motion.div
              key={entry.id}
              className="absolute cursor-move"
              drag
              dragConstraints={{ top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight }}
              initial={{ x: startX, y: entry.y }}
              style={{
                width: `${imageWidth}px`,
                height: `${imageHeight}px`,
                
              }}
              onClick={() => handleEnlarge(entry.id)}
            >
              <motion.div
                animate={{ x: [startX, endX], opacity: [1, 1, 0] }}
                transition={{ duration: entry.duration, ease: 'linear', repeat: Infinity, times: [0, 0.9, 1] }}
                className="w-full h-full"
              >
                <motion.div
                  animate={{ scale: entry.enlarged ? 2 : 1, zIndex: entry.enlarged ? 50 : 10 }}
                  transition={{ duration: 0 }}
                  className="rounded-xl overflow-hidden shadow-xl border-4 border-white bg-white w-full h-full"
                >
                {entry.image ? (
                <img src={entry.image} alt="guest" className="w-full h-full object-contain rounded-xl shadow-xl border-4 border-white bg-white" />
              ) : (
                <div className="w-full h-full flex flex-col justify-center text-center p-4 text-gray-700 text-sm rounded-xl shadow-xl border-4 border-white bg-white">
  <div className="text-lg font-semibold">{entry.name}</div>
  <div className="text-sm">{entry.message}</div>
  <div className="text-xs text-gray-500 mt-1">{entry.date}</div>
</div>
              )}
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                {entry.name} - {entry.message} ({entry.date})
              </div>
                            </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
