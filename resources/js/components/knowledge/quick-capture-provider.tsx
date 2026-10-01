import { createContext, useContext, useState, type ReactNode } from 'react';
import QuickCapture from './quick-capture';

const QuickCaptureContext = createContext<() => void>(() => {});

/**
 * Exposes one Quick Capture trigger to every app page (PRD §11: the button
 * lives in the header and stays reachable from Knowledge, Dashboard and the
 * rest of the shell).
 */
export function QuickCaptureProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <QuickCaptureContext.Provider value={() => setOpen(true)}>
            {children}
            <QuickCapture open={open} onClose={() => setOpen(false)} />
        </QuickCaptureContext.Provider>
    );
}

export function useQuickCapture(): () => void {
    return useContext(QuickCaptureContext);
}
