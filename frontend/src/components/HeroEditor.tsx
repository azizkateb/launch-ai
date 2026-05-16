import React, { useRef, useState } from "react";

type HeroImage = { type?: string; url?: string; alt?: string } | undefined;

interface HeroEditorProps {
  hero?: { image?: HeroImage };
  setHero: (h: { image?: HeroImage } | ((prev?: { image?: HeroImage } | undefined) => { image?: HeroImage })) => void;
}

export function HeroEditor({ hero, setHero }: HeroEditorProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(hero?.image?.url);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setHero((prev: any) => ({ ...(prev || {}), image: { type: "upload", url, alt: file.name } }));
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    setHero((prev: any) => ({ ...(prev || {}), image: undefined }));
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Hero Image</label>
      <div className="flex items-center gap-3">
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded bg-slate-800 px-3 py-1 text-sm text-white"
        >
          Choose
        </button>
        <button type="button" onClick={handleRemove} className="rounded bg-red-600 px-3 py-1 text-sm text-white">
          Remove
        </button>
      </div>

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
