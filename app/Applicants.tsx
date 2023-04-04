import { View, Text } from 'react-native';
import React from 'react';
import { useQuery } from 'react-query';
import { API } from '../configs/axios';

import dayjs from 'dayjs';
import { debug_log } from '../components/Utils';

export interface Applicant {
	NationalId: string;
	FullName: string;
	Gender: 'male' | 'female' | 'other';
	BirthDate?: Date;
	Address: string;
	Phone: string;
	Email?: string;
	ExperienceYears: number;
	AppliedPositionName: string;
	AppliedDate: Date;
	AskingSalary: number;
}

export interface Applicant_API_Response {
	NationalId: string;
	FullName: string;
	Gender: 'male' | 'female' | 'other';
	BirthDate: string | null;
	Address: string;
	Phone: string;
	Email: string | null;
	ExperienceYears: number;
	AppliedPositionName: string;
	AppliedDate: string;
	AskingSalary: number;
}

export function mapToApplicant(res: Applicant_API_Response): Applicant {
	return {
		...res,
		BirthDate: res.BirthDate ? dayjs(res.BirthDate).toDate() : undefined,
		Email: res.Email ?? undefined,
		AppliedDate: dayjs(res.AppliedDate).toDate(),
	};
}

export default function Applicants() {
	const { data, isLoading, refetch } = useQuery('applicants', async () => {
		const res = await API.get('Applicants');

		if (res.status === 200) {
			const data: Applicant_API_Response[] = res.data.Items;
			const applicantNames = data.map((Item) => mapToApplicant(Item).FullName);
			return applicantNames;
		}
	});
	function handleGetApplicants() {
		debug_log('refetching');
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
