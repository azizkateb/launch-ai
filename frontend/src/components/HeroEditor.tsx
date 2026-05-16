import React, { useRef, useState } from "react";

type HeroImage = { type?: string; url?: string; alt?: string } | undefined;

interface HeroEditorProps {
  hero?: { image?: HeroImage };
  setHero: (h: { image?: HeroImage } | ((prev?: { image?: HeroImage } | undefined) => { image?: HeroImage })) => void;
  uploadImage?: (file: File) => Promise<string>;
}

export function HeroEditor({ hero, setHero, uploadImage }: HeroEditorProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(hero?.image?.url);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const validateImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Please select a valid image file.");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image must be smaller than 5MB.");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      validateImageFile(file);
      setUploadError(null);
      const preview = await readFileAsDataUrl(file);
      setPreviewUrl(preview);

      if (uploadImage) {
        setUploading(true);
        const imageUrl = await uploadImage(file);
        setPreviewUrl(imageUrl);
        setHero((prev: any) => ({
          ...(prev || {}),
          image: {
            type: "upload",
            url: imageUrl,
            alt: file.name || "user uploaded image",
          },
        }));
      } else {
        setHero((prev: any) => ({
          ...(prev || {}),
          image: {
            type: "upload",
            url: preview,
            alt: file.name || "user uploaded image",
          },
        }));
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Invalid image file.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    setUploadError(null);
    setHero((prev: any) => ({ ...(prev || {}), image: undefined }));
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Hero Image</label>
      <div className="flex items-center gap-3">
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="rounded bg-slate-800 px-3 py-1 text-sm text-white"
        >
          {uploading ? "Uploading..." : "Choose"}
        </button>
        <button
          type="button"
          onClick={handleRemove}
          disabled={uploading}
          className="rounded bg-red-600 px-3 py-1 text-sm text-white"
        >
          Remove
        </button>
      </div>

      {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

      {previewUrl ? (
        <div className="mt-2 w-full max-w-md overflow-hidden rounded border">
          <img src={previewUrl} alt="preview" className="h-48 w-full object-cover" />
        </div>
      ) : (
        <div className="mt-2 text-sm text-slate-500">No image selected.</div>
      )}
    </div>
  );
}
