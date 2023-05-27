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
import { Link, useRouter } from 'expo-router';
import {
	MaterialIcons,
	MaterialCommunityIcons,
	Fontisto,
	AntDesign,
	SimpleLineIcons,
} from '@expo/vector-icons';

export default function Dashboard() {
	const router = useRouter();
	const { accessToken, unsetLogin } = useAuthStore();

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
			enabled: Boolean(currentEmployeeNationalId) && Boolean(accessToken),
		}
	);

	if (!employeeQuery.data) {
		return <Text>...</Text>;
	}

	return (
		<View className='flex h-full w-full flex-col items-center'>
			<Text className='text-h2 font-bold text-primary-normal'>
				Xin chào {employeeQuery.data.FullName}.
			</Text>

			<Pressable
				className='mt-4 mr-4 flex h-8 w-16 flex-col items-center self-end rounded border-2 border-secondary-dark-2 bg-neutral-white shadow'
				onPress={() => unsetLogin()}
				android_ripple={{ radius: 100 }}
			>
				<MaterialIcons name='logout' size={24} />
				<Text className='mt-3 w-full text-center text-tag'>Đăng xuất</Text>
			</Pressable>

			<Pressable
				className='mt-6 flex h-40 w-40 flex-col items-center rounded border-2 border-secondary-dark-2 bg-neutral-white p-6 shadow'
				onPress={() => router.push('/App/AddAttendance')}
				android_ripple={{
					radius: 120,
				}}
			>
				<MaterialCommunityIcons name='briefcase-clock-outline' size={56} />
				<Text className='mt-6 w-full text-center text-h4'>Chấm Công</Text>
			</Pressable>

			<View className='mt-4 flex w-full flex-row justify-evenly'>
				<Pressable
					className='mt-4 flex h-32 w-32 flex-col items-center rounded border-2 border-secondary-dark-2 bg-neutral-white py-5 px-8 shadow'
					onPress={() => router.push('/App/MyProfile')}
					android_ripple={{ radius: 100 }}
				>
					<Fontisto name='person' size={44} />
					<Text className='mt-3 w-full text-center text-body'>
						Hồ sơ Cá nhân
					</Text>
				</Pressable>
				<Pressable
					className='mt-4 flex h-32 w-32 flex-col items-center rounded border-2 border-secondary-dark-2 bg-neutral-white py-5 px-8 shadow'
					onPress={() => router.push('/App/Request/MyRequests')}
					android_ripple={{ radius: 100 }}
				>
					<AntDesign name='addfile' size={44} />
					<Text className='mt-3 w-full text-center text-body'>Yêu cầu</Text>
				</Pressable>
			</View>

			<View className='mt-4 flex w-full flex-row justify-evenly'>
				<Pressable
					className='mt-4 flex h-32 w-32 flex-col items-center rounded border-2 border-secondary-dark-2 bg-neutral-white py-5 px-6 shadow'
					onPress={() => router.push('/App/MyLeaves')}
					android_ripple={{ radius: 100 }}
				>
					<MaterialCommunityIcons name='calendar-month' size={44} />
					<Text className='mt-3 w-full text-center text-body'>
						Các ngày nghỉ phép
					</Text>
				</Pressable>
				<Pressable
					className='mt-4 flex h-32 w-32 flex-col items-center rounded border-2 border-secondary-dark-2 bg-neutral-white py-5 px-8 shadow'
					onPress={() => router.push('/App/AddFeedback')}
					android_ripple={{ radius: 100 }}
				>
					<SimpleLineIcons name='speech' size={44} />
					<Text className='mt-3 w-full text-center text-body'>Góp ý</Text>
				</Pressable>
			</View>

			{/* <Pressable
				className='mt-4 h-12 border'
				onPress={() => router.push('/App/EXAMPLE')}
			>
				<Text>EXAMPLE</Text>
			</Pressable> */}
		</View>
	);
}
