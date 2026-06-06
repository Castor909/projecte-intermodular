import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="error-boundary">
        <div className="error-boundary__box">
          <h2 className="error-boundary__title">Something went wrong</h2>
          <p className="error-boundary__message">
            {this.state.error.message || 'An unexpected error occurred.'}
          </p>
          <button
            className="btn-connect btn-large"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
