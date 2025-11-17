import { useState, useCallback, type FC, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedFile } from './helpers';
import type { PixelCrop } from './types';
import type { Nullable } from 'types/utils';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button, Slider } from 'components/ui';

interface Props {
  uploadImage: (file: File) => Promise<void>;
}

export const ImageCropper: FC<Props> = ({ uploadImage }) => {
  const { t } = useTranslation();

  const [imageSrc, setImageSrc] = useState<Nullable<string>>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Nullable<PixelCrop>>(null);
  const [loading, setLoading] = useState(false);

  const onCropComplete = useCallback((_croppedArea: PixelCrop, croppedAreaPixels: PixelCrop) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setLoading(true);
    try {
      const file = await getCroppedFile(imageSrc, croppedAreaPixels);
      await uploadImage(file);
    } catch {
      toast.error(t('imageCropper.errorMsg'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  return (
    <div className="flex flex-col gap-4">
      <Button variant="outline" asChild>
        <label className="cursor-pointer">
          {t('imageCropper.select')}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setImageSrc(URL.createObjectURL(file));
            }}
          />
        </label>
      </Button>

      {imageSrc && (
        <>
          <div className="relative w-full h-[400px] aspect-square">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">{t('imageCropper.zoom')}</span>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.01}
              onValueChange={(val) => setZoom(val[0] || 1)}
            />
          </div>

          <Button onClick={() => void handleUpload()} disabled={loading} className="w-fit">
            {t('imageCropper.crop')}
          </Button>
        </>
      )}
    </div>
  );
};
