import { useRef } from 'react';
import { ActionIcon } from '@mantine/core';
import { Camera } from 'lucide-react';

export const PhotoButton = (props: {setPhoto: (photo: File) => void;}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return <>
    <input
      ref={fileInputRef}
      type="file"
      accept='image/*'
      capture="environment"
      style={{ display: 'none' }}
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          props.setPhoto(file);
        }
      }}
    />
    <ActionIcon
      onClick={() => fileInputRef.current?.click()}
      size="md"
    >
      <Camera size={15} />
    </ActionIcon>
  </>
}
