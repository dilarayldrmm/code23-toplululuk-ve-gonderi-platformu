import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, text) => {
    const newNotification = {
      id: Date.now().toString(),
      type: type || 'info',
      text: text || type,
      read: false,
      timestamp: 'Şimdi',
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markRead = id => {
    setNotifications(prev =>
      prev.map(item =>
        item.id === id ? { ...item, read: true } : item
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(item => ({ ...item, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(item => !item.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}