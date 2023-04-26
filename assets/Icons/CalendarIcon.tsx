import { IconProps } from './_Icon.interface';
import Svg, { Path } from 'react-native-svg';

export const CalendarIcon = ({ size, ...props }: IconProps) => {
	return (
		<Svg width={size} height={size} viewBox='0 0 24 24' {...props}>
			<Path
				fill='#182233'
				d='M19 22H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2ZM5 10v10h14V10H5Zm0-4v2h14V6H5Zm12 12h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0H7v-2h2v2Zm8-4h-2v-2h2v2Zm-4 0h-2v-2h2v2Zm-4 0H7v-2h2v2Z'
			/>
		</Svg>
	);
};
