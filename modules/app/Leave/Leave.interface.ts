import dayjs from 'dayjs';

export interface Query_CheckLeave_API_Response {
	IsOnLeave: boolean;
}

export interface Leave {
	StartDate: Date;
	EndDate: Date;
}

export interface Leave_API_Response {
	StartDate: string;
	EndDate: string;
}

export function mapToLeave(res: Leave_API_Response): Leave {
	return {
		StartDate: dayjs(res.StartDate).toDate(),
		EndDate: dayjs(res.EndDate).toDate(),
	};
}
