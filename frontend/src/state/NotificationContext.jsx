import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const timeoutIdsRef = useRef(new Map());

  const generateNotificationId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  };

  const removeNotification = useCallback((id) => {
    const timeoutId = timeoutIdsRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutIdsRef.current.delete(id);
    }

    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = generateNotificationId();
    setNotifications((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      const timeoutId = setTimeout(() => {
        removeNotification(id);
      }, duration);

      timeoutIdsRef.current.set(id, timeoutId);
    }
  }, [removeNotification]);

  useEffect(() => {
    const timeoutIds = timeoutIdsRef.current;
    return () => {
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutIds.clear();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50 w-[calc(100%-2rem)] max-w-sm">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-xl border shadow-lg flex items-start justify-between gap-3 animate-fade-in-up transform transition-all duration-300 backdrop-blur-xl ${
              notification.type === 'error'
                ? 'bg-red-500/90 border-red-300/30 text-white'
                : notification.type === 'success'
                ? 'bg-emerald-500/90 border-emerald-300/30 text-white'
                : 'bg-sky-500/90 border-sky-300/30 text-white'
            }`}
          >
            <span className="text-sm leading-5">{notification.message}</span>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Dismiss notification"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
