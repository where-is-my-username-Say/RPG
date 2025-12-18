import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="w-screen h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center font-mono">
                    <h1 className="text-4xl text-red-500 mb-4">SYSTEM CRITICAL FAILURE</h1>
                    <div className="text-xl mb-4">The application encountered a fatal error.</div>
                    <div className="bg-gray-900 p-4 rounded text-left max-w-2xl overflow-auto border border-red-500/50 mb-8 w-full">
                        <p className="text-red-400 font-bold mb-2">Error Log:</p>
                        <code className="text-sm text-gray-300 break-words">
                            {this.state.error?.toString()}
                        </code>
                    </div>
                    <button
                        onClick={() => {
                            // Clear local storage or session if needed
                            window.location.reload();
                        }}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded font-bold transition-colors"
                    >
                        REBOOT SYSTEM
                    </button>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            sessionStorage.clear();
                            window.location.reload();
                        }}
                        className="mt-4 text-sm text-gray-500 hover:text-white underline"
                    >
                        Emergency Reset (Clears Login)
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
