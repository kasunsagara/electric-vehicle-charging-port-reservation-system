import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { UserProvider } from './context/userContext';

// Screens
import HomePage from './screens/homePage';
import LoginPage from './screens/loginPage';
import SignUpPage from './screens/signUpPage';
import PortStatusPage from './screens/portStatusPage';
import MyAccountPage from './screens/myAccountPage';
import MyBookingsPage from './screens/myBookingsPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="SignUp" component={SignUpPage} />
          <Stack.Screen name="PortStatus" component={PortStatusPage} />
          <Stack.Screen name="MyAccount" component={MyAccountPage} />
          <Stack.Screen name="MyBookings" component={MyBookingsPage} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </UserProvider>
  );
}
