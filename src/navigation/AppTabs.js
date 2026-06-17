import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import FeedScreen from '../screens/FeedScreen';
import EventoDetalheScreen from '../screens/EventoDetalheScreen';
import MeusIngressosScreen from '../screens/MeusIngressosScreen';
import PerfilScreen from '../screens/PerfilScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const headerStyle = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: colors.white,
  headerTitleStyle: { fontWeight: '800' },
};

function FeedStack() {
  return (
    <Stack.Navigator screenOptions={headerStyle}>
      <Stack.Screen name="Feed" component={FeedScreen} options={{ title: 'Eventos' }} />
      <Stack.Screen
        name="EventoDetalhe"
        component={EventoDetalheScreen}
        options={{ title: 'Detalhes do evento' }}
      />
    </Stack.Navigator>
  );
}

const ICONES = {
  FeedTab: 'calendar',
  Ingressos: 'ticket',
  Perfil: 'person',
};

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...headerStyle,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONES[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen
        name="FeedTab"
        component={FeedStack}
        options={{ title: 'Eventos', headerShown: false }}
      />
      <Tab.Screen
        name="Ingressos"
        component={MeusIngressosScreen}
        options={{ title: 'Meus Ingressos' }}
      />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}
