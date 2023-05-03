import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { useQuery } from 'react-query';
import { API } from '../../../configs/axios';
import Toast from 'react-native-root-toast';
import {
	mapToRequest,
	Request_API_Response,
} from '../../../modules/app/Request/Request.interface';
import { useEmployeeStore } from '../../../modules/app/Employee/Employee.store';
import { useRouter } from 'expo-router';
import { Button } from '../../../components/atoms/Button/Button';
import RequestItem from '../../../modules/app/Request/RequestItem';

export default function MyRequests() {
	const router = useRouter();
	const { currentEmployee } = useEmployeeStore();

	const selfRequestsQuery = useQuery('SelfRequests', async () => {
		const res = await API.get(`Requests/Self/${currentEmployee?.NationalId}`);

		if (res.status >= 400) {
			Toast.show('Error!');
			return;
		}

		const data: Request_API_Response[] = res.data;
		const requests = data.map((Item) => mapToRequest(Item));

		return requests;
	});

	if (!selfRequestsQuery.data) {
		return <Text>...</Text>;
	}

	return (
		<View className='flex w-full flex-col items-center'>
			<Text className='mb-8 text-h2 font-bold text-primary-normal'>
				Các yêu cầu của tôi
			</Text>

			<Button
				title='Tạo'
				className='mx-4 self-end'
				width='small'
				onPress={() => router.push('/App/Request/AddRequest')}
			/>

			<ScrollView className='my-4 h-4/5 w-full px-4'>
				{selfRequestsQuery.data.map((request, index) => {
					return <RequestItem request={request} key={index} />;
				})}
			</ScrollView>
		</View>
	);
}
