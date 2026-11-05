import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Root from "./router/index.tsx";
import RequireAuth from "./router/RequireAuth";
import { RouteErrorFallback } from "@/components/shared/ErrorBoundary";

const Home = lazy(() => import("./pages/Home.tsx"));
const Search = lazy(() => import("./pages/Search.tsx"));
const Category = lazy(() => import("./pages/Category.tsx"));
const BlogDetails = lazy(() => import("./pages/BlogDetails.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const CreatePost = lazy(() => import("./pages/CreatePost.tsx"));
const UpdatePost = lazy(() => import("./pages/UpdatePost.tsx"));
const User = lazy(() => import("./pages/User.tsx"));
const Authentication = lazy(() => import("./pages/Authentication.tsx"));
const MissedPostsPage = lazy(() => import("./pages/MissedPosts.tsx"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Root />}
      errorElement={<RouteErrorFallback />}
    >
      <Route index element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/blog/:id" element={<BlogDetails />} />
      <Route path="/category/:title" element={<Category />} />
      <Route path="/profile/:name" element={<Profile />} />
      <Route
        path="/update/:id"
        element={
          <RequireAuth>
            <UpdatePost />
          </RequireAuth>
        }
      />
      <Route
        path="/create"
        element={
          <RequireAuth>
            <CreatePost />
          </RequireAuth>
        }
      />
      <Route path="/missed" element={<MissedPostsPage />} />
      <Route
        path="/user"
        element={
          <RequireAuth>
            <User />
          </RequireAuth>
        }
      />
      <Route path="/auth" element={<Authentication />} />
    </Route>,
  ),
);
function App() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
