import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

// Screens
import HomePage from './screens/homePage';
import LoginPage from './screens/loginPage';
import SignUpPage from './screens/signUpPage';
import PortStatusPage from './screens/portStatusPage';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="SignUp" component={SignUpPage} />
          <Stack.Screen name="PortStatus" component={PortStatusPage} />


        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}
