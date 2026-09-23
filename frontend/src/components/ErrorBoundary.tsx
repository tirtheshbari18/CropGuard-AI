import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in CropGuard AI component tree:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleNavigateHome = () => {
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-lg w-full glass-panel p-8 rounded-3xl border border-rose-500/30 text-center space-y-6 shadow-2xl shadow-rose-950/40">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <AlertOctagon className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Agronomic Runtime Shield
              </span>
              <h1 className="text-xl font-bold text-white mt-3">CropGuard AI Diagnostic Notice</h1>
              <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                An unexpected component rendering interruption was intercepted. CropGuard AI’s protective runtime boundary kept the application safe.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-[11px] font-mono text-rose-300 overflow-x-auto max-h-32">
                <p className="font-semibold text-rose-400 mb-1">Exception Details:</p>
                <p className="break-all">{this.state.error.message || String(this.state.error)}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Dashboard</span>
              </button>

              <button
                onClick={this.handleNavigateHome}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
