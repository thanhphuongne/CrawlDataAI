
/**
 * Object filter of report
 * interface: FilterModel
 */
export const OBJECT_FILTER_CONST: {
  employees: Array<any>;
  employeesSelectedCus: Array<any>;
  blacklist: Array<any>;
  guest: Array<any>;
} = {
  employees: [
    {
      type: 'customer',
      name: 'customerId',
      dataOption: 'listCustomers',
      isGetDataOption: true
    },
    {
      type: 'keyword',
      name: 'keyword',
      placeholder: 'Enter employee account'
    },
    {
      type: 'department',
      name: 'departmentId',
      dataOption: 'listDepartments',
      isGetDataOption: true
    },
    {
      type: 'status',
      name: 'status',
      value: 1
    }
  ],
  employeesSelectedCus: [
    {
      type: 'customer',
      name: 'customerId',
      dataOption: 'listCustomers',
      isGetDataOption: true,
      class: 'd-none'
    },
    {
      type: 'keyword',
      name: 'keyword',
      placeholder: 'Enter employee account',
      class: 'col-lg-4 col-md-4 col-xl-4'
    },
    {
      type: 'department',
      name: 'departmentId',
      dataOption: 'listDepartments',
      isGetDataOption: true,
      class: 'col-lg-4 col-md-4 col-xl-4'

    },
    {
      type: 'status',
      name: 'status',
      value: 1,
      class: 'col-lg-4 col-md-4 col-xl-4'

    }
  ],
  guest: [
    {
      type: 'customer',
      name: 'customerId'
    },
    {
      type: 'keyword',
      name: 'keyword',
      placeholder: 'Enter name'
    }
  ],
  blacklist: [
    {
      type: 'customer',
      name: 'customerId'
    },
    {
      type: 'keyword',
      name: 'keyword',
      placeholder: 'Enter name'
    }
  ]
};
