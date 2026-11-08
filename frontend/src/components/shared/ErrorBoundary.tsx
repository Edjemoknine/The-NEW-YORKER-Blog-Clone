import type { ReactNode } from "react";
import {
  ErrorBoundary as ReactErrorBoundary,
} from "react-error-boundary";
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";

type ErrorBoundaryProps = Readonly<{
  children: ReactNode;
}>;

type ErrorFallbackProps = {
  error?: unknown;
  resetErrorBoundary?: () => void;
  status?: number | null;
};

export const ErrorBoundary = ({ children }: ErrorBoundaryProps) => (
  <ReactErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, errorInfo) =>
      console.error("Uncaught application error:", error, errorInfo)
    }
  >
    {children}
  </ReactErrorBoundary>
);

export const RouteErrorFallback = () => {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : null;

  return <ErrorFallback status={status} />;
};

const ErrorFallback = (props: ErrorFallbackProps) => {
  const { status } = props;

  return (
    <main
      role="alert"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        {status ? `Error ${status}` : "Something went wrong"}
      </p>
      <h1 className="font-editorial text-3xl font-semibold text-foreground">
        This page couldn’t be displayed.
      </h1>
      <p className="max-w-lg text-muted-foreground">
        Please try again or return to the homepage.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={() => window.location.reload()}>
          Reload page
        </Button>
        <Button asChild variant="outline">
          <Link to="/">Go to homepage</Link>
        </Button>
      </div>
    </main>
  );
};
