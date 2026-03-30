export const getFileTypeFromUrl = (url) => {
  if (!url) return "image";

  const extension = url.split(".").pop()?.toLowerCase();

  const imageTypes = ["jpg", "jpeg", "png", "gif", "webp", "bmp"];
  const videoTypes = ["mp4", "mov", "avi", "mkv", "webm"];

  if (imageTypes.includes(extension)) return "image";
  if (videoTypes.includes(extension)) return "video";

  return "image";
};
