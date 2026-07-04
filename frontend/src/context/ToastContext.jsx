import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toast, setToast] = useState({ message: '', type: 'info', active: false });
    const timeoutRef = useRef(null);

    const showToast = useCallback((message, type = 'info') => {
        clearTimeout(timeoutRef.current);
        setToast({ message, type, active: true });
        timeoutRef.current = setTimeout(() => {
            setToast(t => ({ ...t, active: false }));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className={`toast ${toast.type} ${toast.active ? 'active' : ''}`}>
                <div className="toast-content">
                    <span className="toast-message">{toast.message}</span>
                </div>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
