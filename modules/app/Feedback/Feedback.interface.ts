export interface Feedback {
	Title: string;
	Description: string;
	CreatedDate: Date;
	EmployeeNationalId: string;
}

export interface AddFeedbackRequest {
	Title: string;
	Description: string;
	CreatedDate: string;
	EmployeeNationalId: string;
}
