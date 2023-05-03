import { View, Text, Pressable } from 'react-native';
import MuiIcon from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import {
	Request,
	RequestStatus as RequestStatusEnum,
} from './Request.interface';
import dayjs from 'dayjs';

interface RequestItemProps {
	request: Request;
}

export default function RequestItem({
	request: {
		Title,
		Description,
		Type,
		CreatedDate,
		RequestStatus,
		NewSalary,
		StartLeaveDate,
		EndLeaveDate,
	},
}: RequestItemProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	let TypeLabel: string;

	switch (Type) {
		case 'Raise':
			TypeLabel = 'Tăng lương';
			break;
		case 'Leave':
			TypeLabel = 'Nghỉ phép';
			break;
		case 'Other':
			TypeLabel = 'Khác';
			break;
		default:
			TypeLabel = 'DEFAULT';
	}

	return (
		<Pressable
			className='my-2 flex flex-col justify-start rounded border border-primary-dark-2 bg-neutral-white p-2'
			android_ripple={{
				radius: 200,
			}}
			onPress={() => setIsOpen((isOpen) => !isOpen)}
		>
			<View className='flex flex-row items-center justify-between'>
				<View className='flex flex-row items-center'>
					<Text>
						{RequestStatus === RequestStatusEnum.Accepted ? (
							<MuiIcon name='check-circle' size={32} color='green' />
						) : RequestStatus === RequestStatusEnum.Rejected ? (
							<MuiIcon name='cancel' size={32} color='red' />
						) : (
							<MuiIcon name='pending' size={32} color='gray' />
						)}
					</Text>
					<View className='ml-2 flex flex-col'>
						<Text className='mb-1 font-semibold'>{Title}</Text>
						<Text className='text-neutral-gray-7'>Loại: {TypeLabel}</Text>
					</View>
				</View>
				<Text className='pr-2 italic text-neutral-gray-7'>
					{dayjs(CreatedDate).format('DD/MM/YYYY')}
				</Text>
			</View>

			{isOpen ? (
				<View className='mt-1 flex flex-col'>
					<Text className='mb-1'>Nội dung: {Description}</Text>
					{Type === 'Raise' && (
						<Text className='mb-1'>
							Mức lương mới: {NewSalary?.toLocaleString('vi-VN')} đ
						</Text>
					)}
					{Type === 'Leave' && (
						<Text className='mb-1'>
							Từ ngày: {dayjs(StartLeaveDate).format('DD/MM/YYYY')}
						</Text>
					)}
					{Type === 'Leave' && (
						<Text className='mb-0'>
							Đến hết ngày: {dayjs(EndLeaveDate).format('DD/MM/YYYY')}
						</Text>
					)}
				</View>
			) : null}
		</Pressable>
	);
}
