// ChartErrorBoundary.js
import React, { Component } from 'react';

class ChartErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ChartErrorBoundary:', error);
    console.error('Error info:', errorInfo);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <p>Something went wrong while rendering the chart.</p>;
    }

    return this.props.children;
  }
}

export default ChartErrorBoundary;
