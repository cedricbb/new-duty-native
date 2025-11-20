import React, { useEffect } from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing
} from 'react-native-reanimated';

type DinoAvatarProps = {
    source: ImageSourcePropType;
    size?: number;
};

export const DinoAvatar = ({ source, size = 200 }: DinoAvatarProps) => {

    const scale = useSharedValue(1);

    useEffect(() => {
        scale.value = withRepeat(
            withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View style={animatedStyle}>
            <Image
                source={source}
                style={{ width: size, height: size, resizeMode: 'contain' }}
            />
        </Animated.View>
    );
};