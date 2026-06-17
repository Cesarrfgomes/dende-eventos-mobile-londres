import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppTabs from './AppTabs';
import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import { Loading } from '../components/StateView';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { usuario, carregando } = useAuth();

  if (carregando) return <Loading texto="Iniciando..." />;

  return (
    <NavigationContainer>
      {usuario ? (
        <AppTabs />
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
            headerTintColor: colors.primary,
            headerTitle: '',
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Cadastro" component={CadastroScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
