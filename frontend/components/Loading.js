import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';

const LoadingDots = ({ visible = true, color = '#6200ee' }) => {
  const dot1 = useSharedValue(1);
  const dot2 = useSharedValue(1);
  const dot3 = useSharedValue(1);

  React.useEffect(() => {
    if (!visible) return;
 
    dot1.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 300, easing: Easing.ease }),
        withTiming(1, { duration: 300, easing: Easing.ease })
      ),
      -1,
      true
    );

    dot2.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 300, easing: Easing.ease }),
        withTiming(1.4, { duration: 300, easing: Easing.ease }),
        withTiming(1, { duration: 300, easing: Easing.ease })
      ),
      -1,
      true
    );

    dot3.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 300, easing: Easing.ease }),
        withTiming(1, { duration: 300, easing: Easing.ease }),
        withTiming(1.4, { duration: 300, easing: Easing.ease }),
        withTiming(1, { duration: 300, easing: Easing.ease })
      ),
      -1,
      true
    );
  }, [visible]);

  const dot1Style = useAnimatedStyle(() => ({
    transform: [{ scale: dot1.value }],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    transform: [{ scale: dot2.value }],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    transform: [{ scale: dot3.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
    >
      <View style={styles.dotsContainer}>
        <Animated.View style={[styles.dot, dot1Style, { backgroundColor: color }]} />
        <Animated.View style={[styles.dot, dot2Style, { backgroundColor: color }]} />
        <Animated.View style={[styles.dot, dot3Style, { backgroundColor: color }]} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginHorizontal: 6,
  },
});

export default LoadingDots;