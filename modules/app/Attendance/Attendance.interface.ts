import dayjs from 'dayjs';

export type AttendanceType = 'Start' | 'End';

export enum Status {
	Pending = 0,
	Accepted = 1,
	Rejected = -1,
}

export function getStatusLabel(status: Status): string {
	if (status === Status.Pending) {
		return 'Chưa xác nhận';
	} else if (status === Status.Accepted) {
		return 'Đã xác nhận';
	} else if (status === Status.Rejected) {
		return 'Đã từ chối';
	}

	return '';
}

export interface Attendance {
	EmployeeNationalId: string;
	EmployeeFullName: string;
	Status: Status;
	StartTimestamp: Date;
	StartImageFileName: string;
	EndTimestamp?: Date;
	EndImageFileName?: string;
}

export interface Attendance_API_Response {
	EmployeeNationalId: string;
	EmployeeFullName: string;
	Status: Status;
	StartTimestamp: string;
	StartImageFileName: string;
	EndTimestamp: string | null;
	EndImageFileName: string | null;
}

export function mapToAttendance(res: Attendance_API_Response): Attendance {
	return {
		...res,
		StartTimestamp: dayjs(res.StartTimestamp).toDate(),
		EndTimestamp: res.EndTimestamp
			? dayjs(res.EndTimestamp).toDate()
			: undefined,
		EndImageFileName: res.EndImageFileName ? res.EndImageFileName : undefined,
	};
}
