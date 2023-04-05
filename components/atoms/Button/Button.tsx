import { styled } from 'nativewind';

import { Pressable, Text, PressableProps } from 'react-native';

import * as TW from '../../../tailwind.config';
import { logger } from '../../Utils';
import { buttonStyleMapping } from './ButtonStyleMapping';

// const Pressable = styled(RNPressable);

interface ButtonProps extends PressableProps {
	title: string;
	width: 'small' | 'medium' | 'big' | 'full';
	secondary?: boolean;
}

export const Button = ({
	className,
	title,
	width,
	secondary,
	...props
}: ButtonProps) => {
	const classes =
		(className ? className : '') +
		buttonStyleMapping.all +
		(secondary ? buttonStyleMapping.secondary : buttonStyleMapping.primary) +
		buttonStyleMapping[width].width;

	return (
		<Pressable className={classes} {...props}>
			<Text
				className={`text-center ${
					secondary ? 'text-neutral-gray-9' : 'text-neutral-gray-1'
				}`}
			>
				{title}
			</Text>
		</Pressable>
	);
};
