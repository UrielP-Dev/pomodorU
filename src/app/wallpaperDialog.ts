import { open } from "@tauri-apps/plugin-dialog";

export async function pickImageWallpaperPath(): Promise<string | null> {
  const selected = await open({
    multiple: false,
    filters: [
      {
        name: "Imágenes",
        extensions: ["png", "jpg", "jpeg", "gif", "webp"],
      },
    ],
  });
  const path = Array.isArray(selected) ? selected[0] : selected;
  return typeof path === "string" && path.length > 0 ? path : null;
}
