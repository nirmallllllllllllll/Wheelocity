class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-6 bg-[#040406] text-zinc-100">
                    <div className="max-w-md w-full bg-[#111115] border border-red-500/40 p-6 rounded-xl shadow-2xl text-center">
                        <h2 className="text-lg font-bold text-red-400 mb-2">⚠️ Application Error</h2>
                        <p className="text-xs font-mono text-zinc-400 mb-4 bg-black/50 p-3 rounded border border-zinc-800 text-left overflow-auto max-h-32">
                            {this.state.error?.toString()}
                        </p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-[#D4AF37] text-black font-bold text-xs rounded-lg hover:brightness-110 transition-all"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
window.ErrorBoundary = ErrorBoundary;