import React, { useEffect, useState } from 'react';
import { Image, type ImageProps, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MART_COVER_IMAGES } from '@/constants/martImages';
import { resolveMartImage } from '@/utils/martImages';

type MartImageProps = Omit<ImageProps, 'source'> & {
  uri?: string | null;
  mart?: { id?: string; name?: string; image?: string | null; tags?: string[] };
  className?: string;
};

export default function MartImage({ uri, mart, className, ...props }: MartImageProps) {
  const primary = uri ?? (mart ? resolveMartImage(mart) : MART_COVER_IMAGES.default);
  const [src, setSrc] = useState(primary);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(primary);
    setFailed(false);
  }, [primary]);

  if (failed) {
    return (
      <View className={`bg-green-50 items-center justify-center ${className ?? ''}`}>
        <MaterialCommunityIcons name="storefront" size={40} color="#2e7d32" />
      </View>
    );
  }

  return (
    <Image
      {...props}
      className={className}
      source={{ uri: src }}
      resizeMode={props.resizeMode ?? 'cover'}
      onError={() => {
        const fallback = mart ? resolveMartImage({ ...mart, image: null }) : MART_COVER_IMAGES.default;
        if (src !== fallback) {
          setSrc(fallback);
          return;
        }
        setFailed(true);
      }}
    />
  );
}
