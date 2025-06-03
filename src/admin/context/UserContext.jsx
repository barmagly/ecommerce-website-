import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

const USER_KEY = 'adminUserData';

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved
      ? JSON.parse(saved)
      : {
          name: 'محمد أحمد',
          email: 'admin@example.com',
          role: 'مدير النظام',
          avatar: '/images/default-admin.png'
        };
  });

  const updateUserData = (newData) => {
    setUserData(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // في حال تم حذف localStorage من الخارج أو تغييره
  useEffect(() => {
    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
      setUserData(JSON.parse(saved));
    }
  }, []);

  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 