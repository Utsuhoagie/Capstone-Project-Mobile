import dayjs from 'dayjs';

export interface Employee {
	NationalId: string;
	FullName: string;
	Gender: 'Nam' | 'Nữ' | 'Khác';
	BirthDate?: Date;
	Address: string;
	Phone: string;
	Email: string;
	ExperienceYears: number;
	PositionName: string;
	EmployedDate: Date;
	Salary: number;
	HasUser: boolean;
	ImageFileName?: string;
}

export interface Employee_API_Response {
	NationalId: string;
	FullName: string;
	Gender: 'male' | 'female' | 'other';
	BirthDate: string | null;
	Address: string;
	Phone: string;
	Email: string;
	ExperienceYears: number;
	PositionName: string;
	EmployedDate: string;
	Salary: number;
	HasUser: boolean;
	ImageFileName: string | null;
}

export function mapToEmployee(res: Employee_API_Response): Employee {
	let mappedGender: 'Nam' | 'Nữ' | 'Khác';

	switch (res.Gender) {
		case 'male':
			mappedGender = 'Nam';
			break;
		case 'female':
			mappedGender = 'Nữ';
			break;
		case 'other':
			mappedGender = 'Khác';
			break;
	}

	return {
		...res,
		Gender: mappedGender,
		BirthDate: res.BirthDate ? dayjs(res.BirthDate).toDate() : undefined,
		EmployedDate: dayjs(res.EmployedDate).toDate(),
		ImageFileName: res.ImageFileName ? res.ImageFileName : undefined,
	};
}
