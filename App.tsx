import AppNavigator from '@/navigation/AppNavigator';

import React from 'react';
import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
}
