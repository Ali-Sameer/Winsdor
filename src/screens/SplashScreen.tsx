import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

interface AnimatedDotProps {
  delay: number;
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
}

const AnimatedDot: React.FC<AnimatedDotProps> = ({delay, fadeAnim, scaleAnim}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 600,
          delay: delay,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    );
    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, [pulseAnim, delay]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          opacity: fadeAnim,
          transform: [{scale: pulseAnim}],
        },
      ]}
    />
  );
};

const SplashScreen: React.FC<SplashScreenProps> = ({onFinish}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      // Scale animation with bounce
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 20,
        useNativeDriver: true,
      }),
      // Rotate animation (continuous)
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ),
      // Slide up animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Don't auto-finish - wait for onFinish to be called from parent
    // This allows parent to control when splash screen closes
  }, [fadeAnim, scaleAnim, rotateAnim, slideAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}, {rotate}],
          },
        ]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>🍔</Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        <Text style={styles.appName}>Winsdor</Text>
        <Text style={styles.tagline}>Delicious Food at Your Doorstep</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.footerContainer,
          {
            opacity: fadeAnim,
          },
        ]}>
        <View style={styles.loadingDots}>
          <AnimatedDot delay={0} fadeAnim={fadeAnim} scaleAnim={scaleAnim} />
          <AnimatedDot delay={200} fadeAnim={fadeAnim} scaleAnim={scaleAnim} />
          <AnimatedDot delay={400} fadeAnim={fadeAnim} scaleAnim={scaleAnim} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoText: {
    fontSize: 60,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 18,
    color: '#FFF',
    opacity: 0.9,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
});

export default SplashScreen;
