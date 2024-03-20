import React, { useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';

// thirds-party
import { LinearGradient } from 'expo-linear-gradient';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  interpolateColor,
  runOnJS,
} from 'react-native-reanimated';

// project imports
import { useTheme } from '@src/hooks';

const { width, height } = Dimensions.get('window');

const BUTTON_WIDTH = width * 0.75;
const BUTTON_HEIGHT = height * 0.1;
const BUTTON_PADDING = 10;
const SWIPEABLE_DIMENSIONS = BUTTON_HEIGHT - 2 * BUTTON_PADDING;

const H_WAVE_RANGE = SWIPEABLE_DIMENSIONS + 2 * BUTTON_PADDING;
const H_SWIPE_RANGE = BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPEABLE_DIMENSIONS;
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);


const SwipeButton = ({ onToggle }: any) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    colorWave: {
      position: 'absolute',
      left: 0,
      height: BUTTON_HEIGHT,
      borderRadius: BUTTON_HEIGHT,
    },
    swipeable: {
      position: 'absolute',
      left: BUTTON_PADDING,
      height: SWIPEABLE_DIMENSIONS,
      width: SWIPEABLE_DIMENSIONS,
      borderRadius: SWIPEABLE_DIMENSIONS,
      zIndex: 3,
    },
    swipeText: {
      fontFamily: 'Sarabun-Regular',
      alignSelf: 'center',
      fontSize: 16,
      fontWeight: 'bold',
      zIndex: 2,
      color: colors.primaryDark
    },
  });

  // Animated value for X translation
  const X = useSharedValue(0);
  // Toggled State
  const [toggled, setToggled] = useState(false);

  // Fires when animation ends
  const handleComplete = (isToggled: boolean | ((prevState: boolean) => boolean)) => {
    if (isToggled !== toggled) {
      setToggled(isToggled);
      onToggle(isToggled);
    }
  };

  // Gesture Handler Events
  const animatedGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.completed = toggled;
    },
    onActive: (e, ctx) => {
      let newValue;
      if (ctx.completed) {
        newValue = H_SWIPE_RANGE + e.translationX;
      } else {
        newValue = e.translationX;
      }

      if (newValue >= 0 && newValue <= H_SWIPE_RANGE) {
        X.value = newValue;
      }
    },
    onEnd: () => {
      if (X.value < BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS / 2) {
        X.value = withSpring(0);
        runOnJS(handleComplete)(false);
      } else {
        X.value = withSpring(H_SWIPE_RANGE);
        runOnJS(handleComplete)(true);
      }
    },
  });


  const InterpolateXInput = [0, H_SWIPE_RANGE];
  const AnimatedStyles = {
    swipeCont: useAnimatedStyle(() => {
      return {};
    }),
    colorWave: useAnimatedStyle(() => {
      return {
        width: H_WAVE_RANGE + X.value,

        opacity: interpolate(X.value, InterpolateXInput, [0, 1]),
      };
    }),
    swipeable: useAnimatedStyle(() => {
      return {
        backgroundColor: interpolateColor(
          X.value,
          [0, BUTTON_WIDTH - SWIPEABLE_DIMENSIONS - BUTTON_PADDING],
          [String(colors.primary400), '#fff'],
        ),
        transform: [{ translateX: X.value }],
      };
    }),
    swipeText: useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          X.value,
          InterpolateXInput,
          [0.8, -0.08],
          Extrapolate.CLAMP,
        ),
        transform: [
          {
            translateX: interpolate(
              X.value,
              InterpolateXInput,
              [-30, BUTTON_WIDTH / 4 - SWIPEABLE_DIMENSIONS],
              Extrapolate.CLAMP,
            ),
          },
        ],
      };
    }),
  };

  return (
    <Animated.View
      style={[{
        height: BUTTON_HEIGHT,
        width: BUTTON_WIDTH,
        backgroundColor: "#eee",
        borderRadius: BUTTON_HEIGHT,
        padding: BUTTON_PADDING,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
      },
      AnimatedStyles.swipeCont
      ]}
    >
      <AnimatedLinearGradient
        style={[AnimatedStyles.colorWave, styles.colorWave]}
        colors={[String(colors.primary300), String(colors.primaryDark)]}
        start={{ x: 0.0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      />
      <PanGestureHandler onGestureEvent={animatedGestureHandler}>
        <Animated.View style={[styles.swipeable, AnimatedStyles.swipeable]} />
      </PanGestureHandler>
      <Animated.Text style={[styles.swipeText, AnimatedStyles.swipeText]}>
        Swipe To Confirm Use
      </Animated.Text>
    </Animated.View>
  );
};

export default React.memo(SwipeButton);