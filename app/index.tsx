import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAuthStore } from '../modules/auth/Auth.store';

export default function Home() {
	const router = useRouter();
	const { unsetLogin } = useAuthStore();

	return (
		<View className='flex h-full w-full flex-col items-center'>
			<Text className='mb-4'>Home</Text>

			<Link className='mt-4' href='CameraScreen'>
				Go To Camera
			</Link>

			<Link className='mt-4' href='MyProfile'>
				Go To My Profile
			</Link>

			<Pressable
				className='h-20 w-20 bg-accent-normal'
				onPress={() => unsetLogin()}
			>
				<Text>Log out</Text>
			</Pressable>
		</View>
	);
}

// const AppScreen = ({ children }: any) => {
// 	return (
// 		<View className='flex w-full flex-1 flex-col items-center bg-fuchsia-300'>
// 			{children}
// 		</View>
// 	);
// };

// import { View } from 'react-native';
// import { Link, Stack } from 'expo-router';

// export default function Home() {
// 	return (
// 		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
// 			{/* Use the `Screen` component to configure the layout. */}
// 			<Stack.Screen options={{ title: 'Overview' }} />
// 			{/* Use the `Link` component to enable optimized client-side routing. */}
// 			<Link href='/details'>Go to Details</Link>
// 		</View>
// 	);
// }
