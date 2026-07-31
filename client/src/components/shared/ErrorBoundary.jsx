import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ClassConnect Uncaught React Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F8FC] p-6 text-center font-sans">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              !
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-600 mb-4">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            {this.state.errorInfo && (
              <pre className="text-xs text-left bg-slate-100 p-3 rounded-lg overflow-auto max-h-40 mb-6 text-rose-800 font-mono">
                {this.state.error?.stack || JSON.stringify(this.state.errorInfo)}
              </pre>
            )}
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-[#4338F2] text-white font-bold rounded-full hover:bg-[#3730D8] transition-colors"
            >
              Reset & Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
