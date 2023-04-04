import { View, Text } from 'react-native';
import React from 'react';
import { Slot, Stack } from 'expo-router';
import { useAuthRedirect } from '../modules/auth/Auth.hooks';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export default function Layout() {
	useAuthRedirect();

	return (
		// <AppScreen>
		// <Stack initialRouteName='index' />
		// </AppScreen>

		<QueryClientProvider client={queryClient}>
			<View className='flex w-full flex-1 flex-col items-center bg-primary-bright-7 pt-16'>
				<Slot initialRouteName='index' />
			</View>
		</QueryClientProvider>
	);
}
