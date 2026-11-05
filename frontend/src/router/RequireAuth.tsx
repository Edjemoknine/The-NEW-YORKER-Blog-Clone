import { useEffect, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { restoreSession } from "@/context/authSlice";
import type { AppDispatch, RootState } from "@/context/store";

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, sessionStatus } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (sessionStatus === "unknown") {
      dispatch(restoreSession());
    }
  }, [dispatch, sessionStatus]);

  if (sessionStatus === "unknown" || sessionStatus === "checking") {
    return (
      <div className="min-h-screen pt-32 text-center" role="status">
        Checking your session...
      </div>
    );
  }

  if (sessionStatus === "error") {
    return (
      <div className="min-h-screen pt-32 text-center" role="alert">
        <p>Unable to verify your session. Please try again.</p>
        <button
          type="button"
          className="mt-4 underline"
          onClick={() => dispatch(restoreSession())}
        >
          Try again
        </button>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/auth" replace />;
};

export default RequireAuth;
