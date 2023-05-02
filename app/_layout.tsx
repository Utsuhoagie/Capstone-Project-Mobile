import { View, Text, KeyboardAvoidingView } from 'react-native';
import React from 'react';
import { Slot, Stack } from 'expo-router';
import { useAuthRedirect } from '../modules/auth/Auth.hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RootSiblingParent } from 'react-native-root-siblings';
import { NativeBaseProvider } from 'native-base';

const queryClient = new QueryClient();

export default function Layout() {
	useAuthRedirect();

	return (
		// <AppScreen>
		// <Stack initialRouteName='index' />
		// </AppScreen>

		<RootSiblingParent>
			<NativeBaseProvider>
				<QueryClientProvider client={queryClient}>
					{/* <KeyboardAvoidingView
					behavior='position'
					contentContainerStyle={{
						width: '100%',
					}}
					className='flex w-full flex-1 flex-col items-center bg-primary-bright-7 pt-12'
				> */}
					<View className='flex w-full flex-1 flex-col items-center bg-primary-bright-7 pt-12'>
						<Slot initialRouteName='index' />
					</View>
					{/* </KeyboardAvoidingView> */}
				</QueryClientProvider>
			</NativeBaseProvider>
		</RootSiblingParent>
	);
}
