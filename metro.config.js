// Metro configuration for Expo with aliases matching tsconfig paths
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('metro-config').ConfigT} */
const config = getDefaultConfig(__dirname);

config.resolver = config.resolver || {};
config.resolver.alias = {
  ...(config.resolver.alias || {}),
  '@': path.resolve(__dirname, 'src'),
  '@/components': path.resolve(__dirname, 'src/components'),
  '@/screens': path.resolve(__dirname, 'src/screens'),
  '@/hooks': path.resolve(__dirname, 'src/hooks'),
  '@/services': path.resolve(__dirname, 'src/services'),
  '@/utils': path.resolve(__dirname, 'src/utils'),
  '@/types': path.resolve(__dirname, 'src/types'),
};

module.exports = config;
