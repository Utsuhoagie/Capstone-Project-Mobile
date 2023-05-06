import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../modules/auth/Auth.store';
import { useMutation } from 'react-query';
import { AuthAPI } from '../../configs/axios';
import {
	Auth_API_Response,
	JWT_Claims,
} from '../../modules/auth/Auth.interface';
import { logger } from '../../components/Utils';
import jwtDecode from 'jwt-decode';
import { Button } from '../../components/atoms/Button/Button';
import { FormProvider, useForm } from 'react-hook-form';
import { TextInput } from '../../components/atoms/Input/TextInput';
import Toast from 'react-native-root-toast';
import { IS_DEVELOPMENT } from '../../configs/app';
import { useEmployeeStore } from '../../modules/app/Employee/Employee.store';

interface RegisterFormValues {
	Email: string;
	Password: string;
	PasswordConfirm: string;
}

export default function Register() {
	const router = useRouter();
	const { setTokens } = useAuthStore();
	const { setCurrentEmployeeNationalId } = useEmployeeStore();

	const methods = useForm<RegisterFormValues>({
		defaultValues: {
			Email: '',
			Password: '',
			PasswordConfirm: '',
		},
	});

	const mutation = useMutation(
		'register',
		async (formData: RegisterFormValues) => {
			const res = await AuthAPI.post('RegisterEmployee', {
				Email: formData.Email,
				Password: formData.Password,
				PasswordConfirm: formData.PasswordConfirm,
			});

			if (res.status >= 400) {
				Toast.show(`Lỗi đăng kí, ${res.status}, ${res.data}`, {
					duration: Toast.durations.SHORT,
				});
				return;
			}

			Toast.show('Đăng kí thành công!');
			router.replace('/Auth/Login');
		}
	);

	function handleRegister(rawData: RegisterFormValues) {
		// logger(rawData);
		mutation.mutate(rawData);
	}

	return (
		<FormProvider {...methods}>
			<View className='flex flex-col items-center'>
				<TextInput className='mb-4' name='Email' label='Email' width='medium' />
				<TextInput
					className='mb-4'
					name='Password'
					label='Mật khẩu'
					width='medium'
					secureTextEntry
				/>
				<TextInput
					className='mb-4'
					name='PasswordConfirm'
					label='Nhập lại mật khẩu'
					width='medium'
					secureTextEntry
				/>
				<Button
					className='mt-4'
					width='medium'
					onPress={methods.handleSubmit(handleRegister)}
					title='Đăng kí'
				/>
				<Button
					secondary
					className='mt-4'
					width='medium'
					onPress={() => router.push('/Auth/Login')}
					title='Đăng nhập'
				/>
				{IS_DEVELOPMENT && (
					<>
						<Button
							className='mt-6'
							width='medium'
							title='Admin debug'
							onPress={() => {
								methods.setValue('Email', 'master@example.com');
								methods.setValue('Password', '123456aA');
							}}
						/>
						<Button
							className='mt-2'
							width='medium'
							title='Emp debug'
							onPress={() => {
								methods.setValue('Email', 'a@example.com');
								methods.setValue('Password', '123456aA');
							}}
						/>
					</>
				)}
			</View>
		</FormProvider>
	);
}
