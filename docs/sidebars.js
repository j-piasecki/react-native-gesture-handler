module.exports = {
  docs: {
    Basics: [
      'getting-started',
      'about-handlers',
      'state',
      'interactions',
      'example',
    ],
    RNGH2: [
      {
        'Introduction': [
          'rngh2/introduction',
          'rngh2/composing-gestures',
          'rngh2/interoperability-gh',
          'rngh2/edge-cases',
        ]
      },
      {
        'API reference': [
          'rngh2/api/gesture',
          'rngh2/api/gesture-detector',
          'rngh2/api/tap-gesture',
          'rngh2/api/pan-gesture',
          'rngh2/api/long-press-gesture',
          'rngh2/api/fling-gesture',
          'rngh2/api/pinch-gesture',
          'rngh2/api/rotation-gesture',
          'rngh2/api/force-touch-gesture',
          'rngh2/api/native-gesture',
        ]
      },
      {
        'Guides': [
          'rngh2/installation',
          'rngh2/quickstart/quickstart',
        ]
      },
      {
        'Under the hood': [
          'rngh2/states-events',
          'rngh2/how-does-it-work',
        ]
      }
    ],
    'API reference': [
      {
        'Gesture handlers': [
          'api/gesture-handlers/common-gh',
          'api/gesture-handlers/pan-gh',
          'api/gesture-handlers/tap-gh',
          'api/gesture-handlers/longpress-gh',
          'api/gesture-handlers/rotation-gh',
          'api/gesture-handlers/fling-gh',
          'api/gesture-handlers/pinch-gh',
          'api/gesture-handlers/force-gh',
          'api/gesture-handlers/nativeview-gh',
          'api/gesture-handlers/create-native-wrapper'
        ],
        Components: [
          'api/components/buttons',
          'api/components/swipeable',
          'api/components/touchables',
          'api/components/drawer-layout',
        ],
      },
    ],
    Other: ['contributing', 'troubleshooting', 'resources', 'credits'],
  },
};
