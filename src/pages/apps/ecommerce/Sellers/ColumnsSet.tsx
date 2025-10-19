import { PageSize } from '@/components';
import { Link } from 'react-router-dom';
import { CellProps, Column } from 'react-table';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { Seller } from '../types';

/* name column render */
const NameColumn = ({ row, value }: CellProps<Seller>) => {
	return (
		<div className="table-user">
			<img src={row.original.image} alt="" className="me-2 rounded-circle" />
			<Link to="" className="text-body fw-semibold">
				{value}
			</Link>
		</div>
	);
};

/* revenue column render */
const RevenueColumn = () => {
	const options: ApexOptions = {
		chart: {
			type: 'line',
			sparkline: {
				enabled: true,
			},
		},
		series: [],
		stroke: {
			width: 2,
			curve: 'smooth',
		},
		markers: {
			size: 0,
		},
		colors: ['#727cf5'],
		tooltip: {
			fixed: {
				enabled: false,
			},
			x: {
				show: false,
			},
			y: {
				title: {
					formatter: function () {
						return '';
					},
				},
			},
			marker: {
				show: false,
			},
		},
	};

	const series = [{ name: 'data', data: [66, 95, 53, 66, 70, 41, 27, 62, 87, 69, 17] }];

	return <ReactApexChart options={options} series={series} height={35} width={80} />;
};

/* action column render */
const ActionColumn = () => {
	return (
		<>
			<Link to="" className="action-icon">
				<i className="mdi mdi-square-edit-outline"></i>
			</Link>
			<Link to="" className="action-icon">
				<i className="mdi mdi-delete"></i>
			</Link>
		</>
	);
};

// get all columns
// Todo: Generic's values are not provided from the library itself
// const columns: ReadonlyArray<Column<Seller>> =
const columns: ReadonlyArray<Column<any>> = [
	{
		Header: 'Seller',
		accessor: 'name',
		defaultCanSort: true,
		Cell: NameColumn,
	},
	{
		Header: 'Store Name',
		accessor: 'store',
		defaultCanSort: true,
	},
	{
		Header: 'Products',
		accessor: 'products',
		defaultCanSort: true,
	},
	{
		Header: 'Wallet Balance',
		accessor: 'balance',
		defaultCanSort: true,
	},
	{
		Header: 'Created Date',
		accessor: 'created_on',
		defaultCanSort: true,
	},
	{
		Header: 'Revenue',
		accessor: 'id',
		Cell: RevenueColumn,
		defaultCanSort: false,
	},
	{
		Header: 'Action',
		accessor: 'image',
		defaultCanSort: false,
		Cell: ActionColumn,
	},
];

// get pagelist to display
const sizePerPageList: PageSize[] = [
	{
		text: '10',
		value: 10,
	},
	{
		text: '25',
		value: 25,
	},
	{
		text: '50',
		value: 50,
	},
];

export { columns, sizePerPageList };
