import 'react-native-gesture-handler';

import AppNavigator from './src/navigation/AppNavigator';

import { AuthProvider } from './src/context/AuthContext';
import { PostProvider } from './src/context/PostContext';

export default function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <AppNavigator />
      </PostProvider>
    </AuthProvider>
  );
}