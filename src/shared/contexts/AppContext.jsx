import { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state for client-side state (UI, forms, user preferences, etc.)
const initialState = {
  // UI State
  theme: 'dark',
  sidebarCollapsed: false,
  
  // Form states
  activeModal: null,
  activeForm: null,
  
  // User state (auth-related)
  user: null,
  isAuthenticated: false,
  loading: true,
  
  // App-wide notifications/alerts
  notifications: [],
  
  // App preferences
  preferences: {
    language: 'es',
    timezone: 'America/Lima',
    dateFormat: 'dd/MM/yyyy',
  }
};

// Action types
const ActionTypes = {
  // Auth actions
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  SET_AUTH_LOADING: 'SET_AUTH_LOADING',
  
  // UI actions
  SET_THEME: 'SET_THEME',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_ACTIVE_MODAL: 'SET_ACTIVE_MODAL',
  SET_ACTIVE_FORM: 'SET_ACTIVE_FORM',
  
  // Notification actions
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  
  // Preferences
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
      };
      
    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
      
    case ActionTypes.SET_AUTH_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
      
    case ActionTypes.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };
      
    case ActionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      };
      
    case ActionTypes.SET_ACTIVE_MODAL:
      return {
        ...state,
        activeModal: action.payload,
      };
      
    case ActionTypes.SET_ACTIVE_FORM:
      return {
        ...state,
        activeForm: action.payload,
      };
      
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
      
    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
      
    case ActionTypes.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };
      
    case ActionTypes.UPDATE_PREFERENCES:
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };
      
    default:
      return state;
  }
};

// Create contexts
const AppContext = createContext();
const AppDispatchContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          const user = JSON.parse(userData);
          dispatch({ type: ActionTypes.SET_USER, payload: user });
        } else {
          dispatch({ type: ActionTypes.SET_AUTH_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        dispatch({ type: ActionTypes.SET_AUTH_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Load theme preference and apply initial theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      dispatch({ type: ActionTypes.SET_THEME, payload: savedTheme });
    } else {
      // Apply default dark theme on initial mount
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', state.theme);
    // Apply theme to document
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
};

// Custom hooks for easier usage
export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};

export const useAppDispatch = () => {
  const context = useContext(AppDispatchContext);
  if (!context) {
    throw new Error('useAppDispatch must be used within an AppProvider');
  }
  return context;
};

// Convenience hooks for specific parts of state
export const useAuth = () => {
  const { user, isAuthenticated, loading } = useAppState();
  const dispatch = useAppDispatch();

  const login = (userData, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    dispatch({ type: ActionTypes.SET_USER, payload: userData });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    dispatch({ type: ActionTypes.LOGOUT });
  };

  const isTokenValid = () => {
    const token = localStorage.getItem('authToken');
    return !!token;
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    isTokenValid,
  };
};

export const useNotifications = () => {
  const { notifications } = useAppState();
  const dispatch = useAppDispatch();

  const addNotification = (notification) => {
    const id = Date.now().toString();
    dispatch({
      type: ActionTypes.ADD_NOTIFICATION,
      payload: { id, ...notification },
    });
    
    // Auto remove after 5 seconds if not persistent
    if (!notification.persistent) {
      setTimeout(() => {
        dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id });
      }, 5000);
    }
    
    return id;
  };

  const removeNotification = (id) => {
    dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: ActionTypes.CLEAR_NOTIFICATIONS });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
};

export const useTheme = () => {
  const { theme } = useAppState();
  const dispatch = useAppDispatch();

  const setTheme = (newTheme) => {
    dispatch({ type: ActionTypes.SET_THEME, payload: newTheme });
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return { theme, setTheme, toggleTheme };
};

export { ActionTypes };