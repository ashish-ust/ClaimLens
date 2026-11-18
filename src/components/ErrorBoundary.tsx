import { Component, type ErrorInfo, type ReactNode } from 'react';
import Icon from './Icon';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/** Catches rendering errors anywhere below it and shows a recoverable message instead of a blank page. */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ClaimLens render error:', error, info.componentStack);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="container page">
        <div className="card error-state" role="alert">
          <Icon name="cross" className="state-icon" />
          <h2>Something went wrong on this page</h2>
          <p>The page hit an unexpected error. You can try again, or reload the browser tab.</p>
          <button type="button" className="button button-primary" onClick={this.handleReset}>
            <Icon name="refresh" />
            Try again
          </button>
        </div>
      </div>
    );
  }
}
