import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Root from "./router/index.tsx"; // Add type assertion
import Home from "./pages/Home.tsx";
import Search from "./pages/Search.tsx";
import Category from "./pages/Category.tsx";
import BlogDetails from "./pages/BlogDetails.tsx";
import Profile from "./pages/Profile.tsx";
import CreatePost from "./pages/CreatePost.tsx";
import UpdatePost from "./pages/UpdatePost.tsx";
import User from "./pages/User.tsx";
import Authentication from "./pages/Authentication.tsx";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/blog/:id" element={<BlogDetails />} />
      <Route path="/category/:title" element={<Category />} />
      <Route path="/profile/:name" element={<Profile />} />
      <Route path="/update/:id" element={<UpdatePost />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/user" element={<User />} />
      <Route path="/auth" element={<Authentication />} />
    </Route>
  )
);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
