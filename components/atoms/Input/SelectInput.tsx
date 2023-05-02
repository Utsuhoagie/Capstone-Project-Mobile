import { View, Text } from 'react-native';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { CheckIcon, Select } from 'native-base';

interface SelectOption {
	value: any;
	display: string;
}

interface SelectInputProps {
	name: string;
	label: string;
	width: 'full';

	mb?: number;

	options: SelectOption[];
}

export default function SelectInput({
	name,
	label,
	width,
	mb,
	options,
}: SelectInputProps) {
	const methods = useFormContext();

	return (
		<View
			className='flex w-full flex-col'
			style={{ marginBottom: mb ? mb * 4 : 0 }}
		>
			<Text className='mb-1 text-body text-neutral-gray-9'>{label}</Text>

			<Controller
				name={name}
				render={({ field }) => (
					<Select
						className=''
						placeholder='Choose 1'
						borderColor='indigo.900'
						bgColor='white'
						width='full'
						fontSize='md'
						_selectedItem={{
							bg: 'indigo.300',
							endIcon: <CheckIcon />,
						}}
						selectedValue={field.value}
						onValueChange={field.onChange}
					>
						{options.map((option) => (
							<Select.Item
								key={option.value}
								label={option.display}
								value={option.value}
							/>
						))}
					</Select>
				)}
			/>
		</View>
	);
}
