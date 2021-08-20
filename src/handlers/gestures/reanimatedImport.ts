let Reanimated: {
  default: {
    createAnimatedComponent: (Component: any) => any;
  };
  useEvent: (
    callback: (event: any) => void,
    events: string[],
    rebuild: boolean
  ) => any;
  useSharedValue: <T>(value: T) => any;
};

try {
  Reanimated = require('react-native-reanimated');
} catch (e) {
  console.log('RNGH: react-native-reanimated not available');
}

export { Reanimated };
