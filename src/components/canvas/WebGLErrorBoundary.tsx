"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { FallbackArchive2D } from "@/components/fallback/FallbackArchive2D";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("WebGL Scene failed or crashed, falling back to 2D Dossier:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <FallbackArchive2D />;
    }
    return this.props.children;
  }
}
