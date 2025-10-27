import client from "@/db/client";

const destroy = async (imageId: string) => {
  return await client.image.delete({ where: { id: imageId } });
};

export default { destroy };
