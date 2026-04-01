import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageBackground, View } from 'react-native';

export function HeroImage() {
  return (
    <View className="w-full h-[180px] rounded-xl overflow-hidden border border-border bg-surface-hover mb-8">
      <ImageBackground
        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5WJ-OQ331yPG47b0LhDmCA17SoQAhXaixry5qKenfs2b4f8Eh5vI4JNuLZc7SQuFhX_0FPzzRUaaTMSrs6i1dElNpdOVHixsQcAQpcirhv4rGLvQQkQZzlMiltk3_ZedOFJtpkbc9mAWOrlf_go1QpmgWeYQLAnuorFbBEI30ZNAu1wfFukNwt2hNGH71cgoWB2twr9Ys9M3c34Bds9O0UL2_xawGrlzvMqi0l620-h1HgH1bTuee1-9-ngGXMhyh1NfuMHG8Zkk' }}
        className="flex-1 justify-end"
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(250, 248, 245, 0.85)']}
          className="absolute inset-0 z-10"
        />
      </ImageBackground>
    </View>
  );
}
