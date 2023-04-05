import dayjs from 'dayjs';

export interface Employee {
	NationalId: string;
	FullName: string;
	Gender: 'male' | 'female' | 'other';
	BirthDate?: Date;
	Address: string;
	Phone: string;
	Email?: string;
	ExperienceYears: number;
	PositionName: string;
	EmployedDate: Date;
	Salary: number;
	StartHour: number;
	EndHour: number;
	HasUser: boolean;
}

export interface Employee_API_Response {
	NationalId: string;
	FullName: string;
	Gender: 'male' | 'female' | 'other';
	BirthDate: string | null;
	Address: string;
	Phone: string;
	Email: string | null;
	ExperienceYears: number;
	PositionName: string;
	EmployedDate: string;
	Salary: number;
	StartHour: number;
	EndHour: number;
	HasUser: boolean;
}

export function mapToEmployee(res: Employee_API_Response): Employee {
	return {
		...res,
		BirthDate: res.BirthDate ? dayjs(res.BirthDate).toDate() : undefined,
		Email: res.Email ?? undefined,
		EmployedDate: dayjs(res.EmployedDate).toDate(),
	};
}
