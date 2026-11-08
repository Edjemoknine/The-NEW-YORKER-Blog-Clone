import { PostForm } from "@/components/forms/PostForm";

const CreatePost = () => {
  return (
    <main className="page-shell">
      <header className="page-header">
        <p className="page-kicker">Contribute</p>
        <h1 className="page-title">Create a story</h1>
        <p className="page-description">
          Share your reporting, ideas, and perspective with readers.
        </p>
      </header>
      <PostForm />
    </main>
  );
};

export default CreatePost;
