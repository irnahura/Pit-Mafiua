"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Send to logging service (implement later)
    if (typeof window !== 'undefined') {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error details:', {
          error: error.toString(),
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
        });
      }
      
      // In production, send to monitoring service
      // Example: Sentry, LogRocket, etc.
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    
    // Reload the page
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
          <div className="max-w-md w-full glass-card p-8 rounded-xl text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-error" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="font-headline text-2xl text-on-surface font-bold uppercase">
                Something Went Wrong
              </h1>
              <p className="text-on-surface-variant">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-surface-container-lowest p-4 rounded-lg text-left">
                <p className="font-mono text-xs text-error break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full bg-primary text-on-primary font-headline text-lg py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all font-bold flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Reload Page
            </button>

            <p className="text-on-surface-variant text-sm font-mono">
              If the problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
