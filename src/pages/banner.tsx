import { ChangeEvent, useRef, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';

import Image from 'next/image';
import getCroppedImg from '@/util/crop';

const Banner = () => {
  const [fullBanner, setFullBanner] = useState('');
  const [banner, setBanner] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [openEdit, setOpenEdit] = useState(false);

  const openImageEdit = () => {
    setOpenEdit(true);
    if (!banner) {
      setBanner(fullBanner);
    }
  };

  const saveImageEdit = () => {
    setOpenEdit(false);
    showCroppedImage();
  };

  const cancelImageEdit = () => {
    setOpenEdit(false);

    if (fullBanner !== banner) {
      setBanner(fullBanner);
    }
  };

  // upload image
  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files?.length === 0) return;
    const file = e.target.files[0];

    setBanner(URL.createObjectURL(file));
  };

  // edit image
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState<any>(undefined);

  const onCropComplete = async (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(banner, croppedAreaPixels);
      setCroppedImage(croppedImage);
      if (fileInputRef?.current?.files[0]) {
        setFullBanner(URL.createObjectURL(fileInputRef.current.files[0]));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ position: 'relative', height: 350, width: '100%' }}>
      {croppedImage ? (
        <Image alt={''} layout='fill' src={croppedImage} objectFit='cover' />
      ) : (
        <div style={{ position: 'relative', width: '100%' }}>
          <p>Add a Image</p>
        </div>
      )}

      {!openEdit && (
        <button
          color={'blue'}
          style={{
            bottom: '5%',
            position: 'absolute',
            right: '5%',
            border: '1px solid black',
            padding: '10px',
          }}
          onClick={openImageEdit}
        >
          Edit Banner
        </button>
      )}

      {openEdit && (
        <>
          <Cropper
            image={banner}
            crop={crop}
            zoom={zoom}
            aspect={32 / 9}
            style={{
              containerStyle: {},
              cropAreaStyle: {},
              mediaStyle: {
                background: 'white',
              },
            }}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            objectFit='cover'
          />
          <div
            style={{
              display: 'grid',
              bottom: '5%',
              position: 'absolute',
              right: '5%',
              gridAutoFlow: 'column',
            }}
          >
            <button
              style={{ border: '1px solid black', padding: '10px', cursor: 'pointer' }}
              onClick={() => fileInputRef?.current?.click()}
            >
              Select file
            </button>

            <button
              style={{ border: '1px solid black', padding: '10px', cursor: 'pointer' }}
              onClick={cancelImageEdit}
            >
              Cancel
            </button>

            {banner && (
              <button
                style={{
                  border: '1px solid black',
                  padding: '10px',
                  cursor: 'pointer',
                }}
                onClick={saveImageEdit}
              >
                Save
              </button>
            )}
          </div>

          <input
            type='file'
            name='image_URL'
            id='input-file'
            accept='image/*'
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={(e) => handleImage(e)}
          />
        </>
      )}
    </div>
  );
};

export default Banner;
