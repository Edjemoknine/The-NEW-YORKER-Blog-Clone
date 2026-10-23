export const publicUser = (user) => ({
  _id: user.id,
  name: user.name,
  email: user.email,
  bio: user.bio,
  avatar: user.avatar,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const postWithAuthor = (post, author) => ({
  _id: post.id,
  title: post.title,
  desc: post.desc,
  content: post.content,
  date: post.date,
  username: author ? publicUser(author) : post.userId,
  image: post.image,
  categories: post.categories,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});

export const publicCategory = (category) => ({
  _id: category.id,
  name: category.name,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});
