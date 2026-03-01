import cloudinary from "#config/cloudinary.config.js";

export const deleteRemoteAssets = async (ids: string[]) => {
  const deletePromises = ids.map(
    (id) =>
      new Promise<{ result: "ok" }>((resolve, reject) => {
        cloudinary.uploader.destroy(id, { invalidate: true }).then(resolve).catch(reject);
      })
  );
  const results = await Promise.all(deletePromises);
  return results;
};
