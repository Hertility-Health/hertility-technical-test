import { Component, ErrorInfo, ReactNode } from "react";
import "./ErrorBoundary.css";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="errorBoundaryContainer">
          <div className="errorBoundaryContent">
            <h1 className="errorBoundaryTitle">Something went wrong</h1>
            <p className="errorBoundaryMessage">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details className="errorBoundaryDetails">
                <summary>Error details</summary>
                <pre className="errorBoundaryPre">{this.state.error.message}</pre>
              </details>
            )}
            <button className="errorBoundaryButton" onClick={this.handleReset}>
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
