import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    // Clear all localStorage data
    if (
      window.confirm(
        'Dies wird alle deine gespeicherten Daten (Karten, Lernsessions, Quiz-Ergebnisse) löschen. Fortfahren?'
      )
    ) {
      localStorage.clear();
      // Reset error state
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
      // Reload the page
      window.location.reload();
    }
  };

  handleReload = (): void => {
    // Just reload without clearing data
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <div className="error-icon" role="img" aria-label="Fehler">
              ⚠️
            </div>

            <h1>Oops! Etwas ist schiefgelaufen</h1>

            <p className="error-message">
              Die Anwendung ist auf einen unerwarteten Fehler gestoßen. Dies
              kann verschiedene Ursachen haben.
            </p>

            <div className="error-actions">
              <button
                onClick={this.handleReload}
                className="btn-primary"
                aria-label="Seite neu laden"
              >
                🔄 Seite neu laden
              </button>

              <button
                onClick={this.handleReset}
                className="btn-danger"
                aria-label="App zurücksetzen und alle Daten löschen"
              >
                🗑️ App zurücksetzen
              </button>
            </div>

            <details className="error-details">
              <summary>Technische Details (für Entwickler)</summary>
              <div className="error-stack">
                <h3>Fehlermeldung:</h3>
                <pre>{this.state.error?.toString()}</pre>

                {this.state.errorInfo && (
                  <>
                    <h3>Component Stack:</h3>
                    <pre>{this.state.errorInfo.componentStack}</pre>
                  </>
                )}
              </div>
            </details>

            <div className="error-help">
              <h3>Was kannst du tun?</h3>
              <ul>
                <li>
                  <strong>Seite neu laden:</strong> Oft hilft ein einfacher
                  Reload, um das Problem zu beheben.
                </li>
                <li>
                  <strong>App zurücksetzen:</strong> Löscht alle gespeicherten
                  Daten und setzt die App auf den Ausgangszustand zurück. Nutze
                  dies nur, wenn das Neuladen nicht funktioniert.
                </li>
                <li>
                  <strong>Browser-Cache leeren:</strong> Manchmal können
                  veraltete Daten im Cache zu Problemen führen.
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
