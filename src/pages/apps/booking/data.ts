export interface BookingData {
	id: string;
	orderId: string;
	customerName: string;
	bookingTime: string;
	amount: number;
	appointmentTime: string;
	services: string[];
	status: 'new' | 'expired' | 'upcoming' | 'unassigned' | 'processed';
}

export const BookingData: BookingData[] = [
	{
		id: '1',
		orderId: 'BK001',
		customerName: 'John Smith',
		bookingTime: '2024-01-15 10:30 AM',
		amount: 150,
		appointmentTime: '2024-01-20 2:00 PM',
		services: ['Washing Machine Repair', 'Maintenance Check'],
		status: 'new'
	},
	{
		id: '2',
		orderId: 'BK002',
		customerName: 'Sarah Johnson',
		bookingTime: '2024-01-14 3:15 PM',
		amount: 200,
		appointmentTime: '2024-01-18 11:00 AM',
		services: ['Electrical Wiring', 'Outlet Installation'],
		status: 'new'
	},
	{
		id: '3',
		orderId: 'BK003',
		customerName: 'Mike Davis',
		bookingTime: '2024-01-13 9:45 AM',
		amount: 80,
		appointmentTime: '2024-01-16 4:30 PM',
		services: ['AC Maintenance'],
		status: 'expired'
	},
	{
		id: '4',
		orderId: 'BK004',
		customerName: 'Emily Wilson',
		bookingTime: '2024-01-12 2:20 PM',
		amount: 120,
		appointmentTime: '2024-01-25 10:00 AM',
		services: ['Refrigerator Repair', 'Seal Replacement'],
		status: 'upcoming'
	},
	{
		id: '5',
		orderId: 'BK005',
		customerName: 'David Brown',
		bookingTime: '2024-01-11 1:10 PM',
		amount: 90,
		appointmentTime: '2024-01-17 3:15 PM',
		services: ['Plumbing Fix'],
		status: 'unassigned'
	},
	{
		id: '6',
		orderId: 'BK006',
		customerName: 'Lisa Anderson',
		bookingTime: '2024-01-10 4:30 PM',
		amount: 180,
		appointmentTime: '2024-01-15 1:00 PM',
		services: ['Washing Machine Repair', 'Drum Replacement'],
		status: 'processed'
	},
	{
		id: '7',
		orderId: 'BK007',
		customerName: 'Robert Taylor',
		bookingTime: '2024-01-09 11:45 AM',
		amount: 110,
		appointmentTime: '2024-01-22 2:30 PM',
		services: ['Electrical Panel Check', 'Circuit Breaker Fix'],
		status: 'new'
	},
	{
		id: '8',
		orderId: 'BK008',
		customerName: 'Jennifer Martinez',
		bookingTime: '2024-01-08 3:00 PM',
		amount: 160,
		appointmentTime: '2024-01-19 9:30 AM',
		services: ['Dishwasher Repair', 'Water Pump Replacement'],
		status: 'new'
	},
	{
		id: '9',
		orderId: 'BK009',
		customerName: 'James Wilson',
		bookingTime: '2024-01-07 10:15 AM',
		amount: 75,
		appointmentTime: '2024-01-14 5:00 PM',
		services: ['Light Fixture Installation'],
		status: 'expired'
	},
	{
		id: '10',
		orderId: 'BK010',
		customerName: 'Amanda Garcia',
		bookingTime: '2024-01-06 2:45 PM',
		amount: 140,
		appointmentTime: '2024-01-23 11:30 AM',
		services: ['Microwave Repair', 'Magnetron Replacement'],
		status: 'upcoming'
	},
	{
		id: '11',
		orderId: 'BK011',
		customerName: 'Christopher Lee',
		bookingTime: '2024-01-05 1:30 PM',
		amount: 95,
		appointmentTime: '2024-01-21 4:00 PM',
		services: ['Ceiling Fan Installation'],
		status: 'unassigned'
	},
	{
		id: '12',
		orderId: 'BK012',
		customerName: 'Michelle Rodriguez',
		bookingTime: '2024-01-04 9:00 AM',
		amount: 220,
		appointmentTime: '2024-01-13 12:30 PM',
		services: ['Complete Home Electrical Inspection', 'Safety Check'],
		status: 'processed'
	},
	{
		id: '13',
		orderId: 'BK013',
		customerName: 'Daniel Kim',
		bookingTime: '2024-01-03 4:20 PM',
		amount: 85,
		appointmentTime: '2024-01-24 3:45 PM',
		services: ['TV Mount Installation'],
		status: 'new'
	},
	{
		id: '14',
		orderId: 'BK014',
		customerName: 'Ashley Thompson',
		bookingTime: '2024-01-02 12:15 PM',
		amount: 175,
		appointmentTime: '2024-01-26 10:15 AM',
		services: ['Oven Repair', 'Thermostat Replacement'],
		status: 'new'
	},
	{
		id: '15',
		orderId: 'BK015',
		customerName: 'Matthew White',
		bookingTime: '2024-01-01 3:45 PM',
		amount: 105,
		appointmentTime: '2024-01-27 2:00 PM',
		services: ['Water Heater Maintenance', 'Filter Replacement'],
		status: 'upcoming'
	}
];
