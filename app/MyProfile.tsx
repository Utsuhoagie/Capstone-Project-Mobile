import { View, Text } from 'react-native';
import React from 'react';
import { useQuery } from 'react-query';
import { API } from '../configs/axios';

import dayjs from 'dayjs';
import { logger } from '../components/Utils';

export default function MyProfile() {
	const { data, isLoading, refetch } = useQuery(['applicants'], async () => {
		const res = await API.get('Applicants');

		if (res.status === 200) {
			const data: Applicant_API_Response[] = res.data.Items;
			const applicantNames = data.map((Item) => mapToApplicant(Item).FullName);
			return applicantNames;
		}
	});
	function handleGetApplicants() {
		logger('refetching');
		refetch();
	}

	if (isLoading) return <Text>Is Loading...</Text>;

	return (
		<View>
			<Text onPress={handleGetApplicants}>Get Applicants</Text>
			{data
				? data.map((datum) => <Text className='mt-2 bg-pink-200'>{datum}</Text>)
				: 'UNDEFINED'}
		</View>
	);
}
