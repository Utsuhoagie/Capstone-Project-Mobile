import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { clone } from 'ramda';
import { Employee } from './Employee.interface';
// import { DisplayConfigs } from '../../../app/App.display';
// import {
// 	EMPLOYEE_FIELDS,
// 	EMPLOYEE_DISPLAY_MODE_MAPPERS,
// 	EMPLOYEE_FORMATTABLE_FIELD_MAPPERS,
// 	EMPLOYEE_FORMATTERS,
// 	EMPLOYEE_LABELLERS,
// 	EMPLOYEE_MAPPERS,
// } from './Employee.display';

interface EmployeeStore {
	// Server state
	currentEmployee: Employee | undefined;
	setCurrentEmployee: (_employee: Employee) => void;

	currentEmployeeNationalId: string | undefined;
	setCurrentEmployeeNationalId: (NationalId: string) => void;

	// Client state
	/* employeesOnPage: Employee[];
	setEmployeesOnPage: (_employeesOnPage: Employee[]) => void; */
	// selectedEmployee: Employee | undefined;
	// setSelectedEmployee: (_employee: Employee | undefined) => void;
	// displayConfigs: DisplayConfigs;
	// setDisplayConfigs: (_displayConfigs: DisplayConfigs) => void;
}

export const useEmployeeStore = create<EmployeeStore>()(
	devtools((set) => ({
		// Server state
		currentEmployee: undefined,
		setCurrentEmployee: (_visibleEmployee: Employee) =>
			set((prev) => {
				let next = clone(prev);
				next.currentEmployee = _visibleEmployee;
				return next;
			}),

		currentEmployeeNationalId: undefined,
		setCurrentEmployeeNationalId: (NationalId: string) =>
			set((prev) => {
				let next = clone(prev);
				next.currentEmployeeNationalId = NationalId;
				return next;
			}),

		// Client state
		/* employeesOnPage: [],
		setEmployeesOnPage: (_employeesOnPage: Employee[]) =>
			set((prev) => {
				let next = clone(prev);
				next.employeesOnPage = _employeesOnPage;
				return next;
			}), */
		// selectedEmployee: undefined,
		// setSelectedEmployee: (_employee: Employee | undefined) =>
		// 	set((prev) => {
		// 		let next = clone(prev);
		// 		next.selectedEmployee = _employee;
		// 		return next;
		// 	}),

		// displayConfigs: {
		// 	fields: EMPLOYEE_FIELDS,
		// 	labellers: EMPLOYEE_LABELLERS,
		// 	displayModeMappers: EMPLOYEE_DISPLAY_MODE_MAPPERS,
		// 	mappers: EMPLOYEE_MAPPERS,
		// 	formattableFieldMappers: EMPLOYEE_FORMATTABLE_FIELD_MAPPERS,
		// 	formatters: EMPLOYEE_FORMATTERS,
		// },
		// setDisplayConfigs: (_displayConfigs: DisplayConfigs) =>
		// 	set((prev) => {
		// 		let next = clone(prev);
		// 		next.displayConfigs = _displayConfigs;
		// 		return next;
		// 	}),
	}))
);
