import React from 'react';
import useSessionActions from "../../state/session/useSessionActions.ts";

type PlayerImageProps = {
  playerId: string,
  image?: string
};

const PlayerImage: React.FC<PlayerImageProps> = ({ playerId, image }) => {
  const { updatePlayerField } = useSessionActions();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== 'string') return;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 128;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressed = canvas.toDataURL('image/jpeg', 0.9); // quality 90%
          updatePlayerField(playerId, 'image', compressed)
        }
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <label className="w-40 h-40 rounded-full overflow-hidden border-2 border-zinc-600 cursor-pointer relative group">
        {image ? (
          <img
            src={image}
            alt="Player portrait"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-zinc-700 flex items-center justify-center text-zinc-400 text-3xl">
            <label className="text-xs text-blue-400 cursor-pointer hover:underline"> Upload Image </label>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>
    </div>
  );
};

export default PlayerImage;
