import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-md shadow-lg flex items-center justify-between min-w-[300px] animate-fade-in-up transform transition-all duration-300 ${
              notification.type === 'error'
                ? 'bg-red-500 text-white'
                : notification.type === 'success'
                ? 'bg-emerald-500 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 text-white/80 hover:text-white"
            >
              x
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
