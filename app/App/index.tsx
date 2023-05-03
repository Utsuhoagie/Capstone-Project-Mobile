import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useAuthStore } from '../../modules/auth/Auth.store';
import { useEmployeeStore } from '../../modules/app/Employee/Employee.store';
import { useQuery } from 'react-query';
import { API } from '../../configs/axios';
import Toast from 'react-native-root-toast';
import {
	Employee_API_Response,
	mapToEmployee,
} from '../../modules/app/Employee/Employee.interface';
import { Link } from 'expo-router';

export default function Dashboard() {
	const { unsetLogin } = useAuthStore();

	const { currentEmployeeNationalId, currentEmployee, setCurrentEmployee } =
		useEmployeeStore();

	const employeeQuery = useQuery(
		['employees', currentEmployeeNationalId],
		async () => {
			const res = await API.get(`Employees/${currentEmployeeNationalId}`);

			if (res.status >= 400) {
				Toast.show(`Error! ${res.status}`);
			}

			const data: Employee_API_Response = res.data;
			const employee = mapToEmployee(data);

			setCurrentEmployee(employee);

			return employee;
		},
		{
			enabled: Boolean(currentEmployeeNationalId),
		}
	);

	if (!employeeQuery.data) {
		return <Text>...</Text>;
	}

	return (
		<View className='flex h-full w-full flex-col items-center'>
			<Text className='mb-4'>Home</Text>

			<Link className='mt-4 h-8' href='/App/AddAttendance'>
				Chấm Công
			</Link>

			<Link className='mt-4 h-8' href='/App/MyProfile'>
				Hồ sơ Cá nhân
			</Link>

			<Link className='mt-4 h-8' href='/App/Request/MyRequests'>
				Yêu cầu
			</Link>

			<Link className='mt-4 h-8' href='/App/AddFeedback'>
				Góp Ý
			</Link>

			<Link className='mt-4 h-8' href='/App/EXAMPLE'>
				EXAMPLE
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
