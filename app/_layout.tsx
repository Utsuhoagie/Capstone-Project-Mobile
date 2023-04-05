import { View, Text, KeyboardAvoidingView } from 'react-native';
import React from 'react';
import { Slot, Stack } from 'expo-router';
import { useAuthRedirect } from '../modules/auth/Auth.hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RootSiblingParent } from 'react-native-root-siblings';

const queryClient = new QueryClient();

export default function Layout() {
	useAuthRedirect();

	return (
		// <AppScreen>
		// <Stack initialRouteName='index' />
		// </AppScreen>

		<RootSiblingParent>
			<QueryClientProvider client={queryClient}>
				<KeyboardAvoidingView
					// behavior='position'
					className='flex w-full flex-1 flex-col items-center bg-primary-bright-7 pt-16'
				>
					<Slot initialRouteName='index' />
				</KeyboardAvoidingView>
			</QueryClientProvider>
		</RootSiblingParent>
	);
}
