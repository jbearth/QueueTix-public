import React from 'react';

// thirds-party
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// project-imports
import {
  Home,
  HistoryPurchaseTicket,
  ShowAmusementPark,
  Profile,
  ShowFastpassToUse
} from '../screens';
import { CustomHeader } from './Screens';
import { Block, Text, Button } from '../components';
import { useTheme, useTranslation } from '../hooks';

const Tab = createBottomTabNavigator();

/* custom bottom tab menu */
const BottomTabContent = ({ state, descriptors, navigation }: any) => {
  const { t, setLocale } = useTranslation();
  const { assets, colors, sizes } = useTheme();
  React.useEffect(() => {
    setLocale("en")
  }, [])
  return (
    <Block
      flex={0}
      row
      height={sizes.height * 0.09}
      width={sizes.width * 0.9}
      style={{
        alignSelf: 'center',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.black,
      }}
      justify='space-around'
      align='center'
      bgcolor={colors.primaryMain}
    >
      {state.routes.map((route: { key: string | number; name: any; }, index: any) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Button
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            bgcolor={isFocused ? colors.secondaryMain : 'transparent'}
            flex={0}
            width={'18%'}
            height={'85%'}
            radius={12}
          >
            <Block
              flex={0}
              align="center"
              justify="center"
              width={'100%'}
              height={'48%'}
            >
              <MaterialCommunityIcons
                size={30}
                name={index === 0 ? "home-outline"
                  : index === 1 ? "ticket"
                    : index === 2 ? "run-fast"
                      : "account-circle-outline"
                }
                color={colors.white}
              />
            </Block>
            <Text semibold={isFocused} color={colors.white}>
              {label}
            </Text>
          </Button>
        );
      })}
    </Block>
  );
}

export default function TabNavigator() {

  React.useEffect(() => {
    console.log("test222")
  }, [])

  return (
    <Tab.Navigator
      initialRouteName='Home'
      tabBar={(props) => <BottomTabContent {...props} />}
      screenOptions={{
        tabBarStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />

      <Tab.Screen
        name="Tickets"
        component={HistoryPurchaseTicket}
        options={{ headerShown: false }}
      />

      <Tab.Screen
        name="Fastpass"
        component={ShowFastpassToUse}
        options={{ headerShown: false }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator >
  )
}
