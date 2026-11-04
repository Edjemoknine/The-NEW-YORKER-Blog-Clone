export const getOptimizedImageUrl = (src: string, width: number) => {
  const url = new URL(src, "https://example.com");
  if (url.hostname !== "res.cloudinary.com") return src;

  const uploadPath = "/image/upload/";
  const uploadIndex = url.pathname.indexOf(uploadPath);
  if (uploadIndex === -1) return src;

  const assetPath = url.pathname.slice(uploadIndex + uploadPath.length);
  if (/^(?:f_|q_|w_\d+|h_\d+|c_)/.test(assetPath)) return src;

  const uploadPrefix = url.pathname.slice(
    0,
    uploadIndex + uploadPath.length,
  );
  url.pathname = `${uploadPrefix}f_auto,q_auto,w_${width},c_limit/${assetPath}`;
  return url.toString();
};
