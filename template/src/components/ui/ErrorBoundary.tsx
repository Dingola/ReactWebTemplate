import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    // Replace this with an application-specific monitoring integration when needed.
    console.error('Unhandled rendering error', error, info);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <main className="fatal-error" role="alert">
          <h1>Something went wrong</h1>
          <p>Reload the page and try again.</p>
        </main>
      );
    }

    return this.props.children;
  }
}
