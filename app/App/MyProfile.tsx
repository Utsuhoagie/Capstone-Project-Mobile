import { View, Text } from 'react-native';
import React from 'react';
import { useQuery } from 'react-query';
import { API } from '../../configs/axios';

import dayjs from 'dayjs';
import { logger } from '../../components/Utils';
import {
	Employee_API_Response,
	mapToEmployee,
} from '../../modules/app/Employee/Employee.interface';

export default function MyProfile() {
	const { data, isLoading, refetch } = useQuery(['applicants'], async () => {
		const res = await API.get('Applicants');

		if (res.status === 200) {
			const data: Employee_API_Response[] = res.data.Items;
			const employeeNames = data.map((Item) => mapToEmployee(Item).FullName);
			return employeeNames;
		}
	});
	function handleGetApplicants() {
		logger('refetching');
		refetch();
	}

	if (isLoading) return <Text>Is Loading...</Text>;

	return (
		<View>
			<Text onPress={handleGetApplicants}>Get Employees</Text>
			{data
				? data.map((datum) => <Text className='mt-2 bg-pink-200'>{datum}</Text>)
				: 'UNDEFINED'}
		</View>
	);
}
