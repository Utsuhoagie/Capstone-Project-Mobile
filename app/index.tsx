import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Toast from 'react-native-root-toast';
import { useQuery } from 'react-query';
import { API } from '../configs/axios';
import {
	Employee_API_Response,
	mapToEmployee,
} from '../modules/app/Employee/Employee.interface';
import { useEmployeeStore } from '../modules/app/Employee/Employee.store';
import { useAuthStore } from '../modules/auth/Auth.store';

export default function Home() {
	const router = useRouter();

	return <View className=''></View>;
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
