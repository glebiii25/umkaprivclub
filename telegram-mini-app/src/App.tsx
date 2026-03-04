import { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  init,
  bindThemeParamsCssVars,
  mountViewport,
  expandViewport,
  useSignal,
  initDataUser,
} from '@telegram-apps/sdk-react';
import { checkAccess } from './utils/auth';
import { NoAccess } from './pages/NoAccess';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Module } from './pages/Module';
import { Subscription } from './pages/Subscription';
import { Payment } from './pages/Payment';
import { Lessons } from './pages/Lessons';
import { Lesson } from './pages/Lesson';
import TestWeek from './pages/TestWeek';
import ProgramLevel from './pages/ProgramLevel';
import ProgramSchedule from './pages/ProgramSchedule';
import MiniTest from './pages/MiniTest';
import Schedule from './pages/Schedule';
import Exercise from './pages/Exercise';
import { Favorites } from './pages/Favorites';

const LOADING_TIMEOUT_MS = 2500;

function AccessGate() {
  const tgUser = useSignal(initDataUser);
  const [status, setStatus] = useState<'loading' | 'allowed' | 'denied'>('loading');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (tgUser?.id != null) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      checkAccess(tgUser.id)
        .then((allowed) => setStatus(allowed ? 'allowed' : 'denied'))
        .catch(() => setStatus('denied'));
      return;
    }
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      // При открытом доступе пускаем и без tg user id (истёк таймаут ожидания)
      setStatus((s) => (s === 'loading' ? 'allowed' : s));
    }, LOADING_TIMEOUT_MS);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [tgUser?.id]);

  if (status === 'loading') {
    return (
      <div
        className="min-h-screen safe-area-padding flex items-center justify-center"
        style={{ backgroundColor: 'rgb(0,0,0)', color: 'rgb(255,255,255)' }}
      >
        <p className="text-[17px] opacity-80">Загрузка...</p>
      </div>
    );
  }

  if (status === 'denied') {
    return <NoAccess />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/module/:id" element={<Module />} />
      <Route path="/module/:id/lessons" element={<Lessons />} />
      <Route path="/module/:moduleId/program/:programId/level/:levelId" element={<ProgramLevel />} />
      <Route path="/module/:moduleId/program/:programId/level/:levelId/schedule" element={<ProgramSchedule />} />
      <Route path="/module/:moduleId/program/:programId/level/:levelId/mini-test" element={<MiniTest />} />
      <Route path="/module/:moduleId/level/final/lesson/:lessonId" element={<TestWeek />} />
      <Route path="/module/:moduleId/level/:levelId/lesson/:lessonId" element={<Lesson />} />
      <Route path="/module/:moduleId/level/:levelId/schedule" element={<Schedule />} />
      <Route path="/module/:moduleId/level/:levelId/exercise/:exerciseSlug" element={<Exercise />} />
      <Route path="/module/:moduleId/exercise/:exerciseSlug" element={<Exercise />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/payment" element={<Payment />} />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    try {
      const cleanup = init();
      return cleanup;
    } catch {
      return () => {};
    }
  }, []);

  useEffect(() => {
    if (bindThemeParamsCssVars?.isAvailable?.()) {
      const unbind = bindThemeParamsCssVars();
      return () => {
        if (typeof unbind === 'function') unbind();
      };
    }
  }, []);

  useEffect(() => {
    if (mountViewport?.isAvailable?.()) {
      mountViewport()
        .then(() => {
          if (expandViewport?.isAvailable?.()) expandViewport();
        })
        .catch(() => {});
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen safe-area-padding" style={{ backgroundColor: 'rgb(0,0,0)' }}>
        <AccessGate />
      </div>
    </BrowserRouter>
  );
}

export default App;
