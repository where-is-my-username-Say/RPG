import { useUIStore } from '../../store/uiStore';
import { Toast } from './Toast';
import { AnimatePresence } from 'framer-motion';

export function ToastContainer() {
    const toasts = useUIStore((state) => state.toasts);

    return (
        <div className="fixed top-4 right-4 z-[99999] flex flex-col items-end pointer-events-none p-4">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <Toast key={toast.id} toast={toast} />
                ))}
            </AnimatePresence>
        </div>
    );
}
