import { View, Text } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from 'react-query';
import {
	Leave_API_Response,
	mapToLeave,
} from '../../modules/app/Leave/Leave.interface';
import { API } from '../../configs/axios';
import { useEmployeeStore } from '../../modules/app/Employee/Employee.store';
import dayjs from 'dayjs';

export default function MyLeaves() {
	const { currentEmployee } = useEmployeeStore();
	const getLeavesOfEmployeeQuery = useQuery(
		['Leaves', { NationalId: currentEmployee?.NationalId }],
		async () => {
			const res = await API.get(`Leaves/${currentEmployee?.NationalId}`);

			// if (res.status >= 400) {
			// 	showToast({ state: 'error' });
			// 	return;
			// }

			const leaves: Leave_API_Response[] = res.data;

			return leaves.map((leave) => mapToLeave(leave));
		}
	);

	if (getLeavesOfEmployeeQuery.isLoading || getLeavesOfEmployeeQuery.isError) {
		return <Text>...</Text>;
	}

	return (
		<View className='flex h-full w-full flex-col items-center'>
			<Text className='pt-2 text-h2 font-bold text-primary-normal'>
				Các ngày nghỉ phép
			</Text>

			<View className='mt-2 flex flex-col p-4'>
				{getLeavesOfEmployeeQuery.data &&
				getLeavesOfEmployeeQuery.data.length > 0 ? (
					getLeavesOfEmployeeQuery.data.map((leave, index) => {
						const StartDate = dayjs(leave.StartDate).format('DD/MM/YYYY');
						const EndDate = dayjs(leave.EndDate).format('DD/MM/YYYY');
						const diff =
							dayjs(leave.EndDate).diff(dayjs(leave.StartDate), 'day') + 1;

						return (
							<Text
								key={index}
								className='mt-2 rounded border border-primary-normal bg-neutral-white p-2 text-neutral-gray-9 shadow'
							>
								{StartDate} - {EndDate} ({diff} ngày)
							</Text>
						);
					})
				) : (
					<Text>Không có</Text>
				)}
			</View>
		</View>
	);
}
