'use client';

import { isSameDay } from 'date-fns';
import isEqual from 'lodash/isEqual';
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import { Stack, Divider } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { useRouter } from 'src/routes/hooks';

import { _invoices } from 'src/_mock';
import { useAuthContext } from 'src/auth/hooks';
import { getSumary, exportData, getSubmitList, getCountWaitingConfirm } from 'src/api/campaign';
import { getAdminList, getApproverList } from 'src/api/campaign-detail';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
// import { useSettingsContext } from 'src/components/settings';
import { MotionViewport } from 'src/components/animate';
import {
  useTable,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import loadTable from 'src/sections/account/account-table-skeleton';

import AdminTable from './admin-table';
import ApproverTable from './approver-table';
import MysubmitTableRow from '../mysubmit-table-row';
import CommissionAnalytic from '../commission-analytic';
import FilterTableToolbar from '../submit-table-toolbar';

const TABLE_HEAD = [
  { id: 'id', label: 'No.', align: 'center' },
  { id: 'accountName', label: 'Contributer' },
  { id: 'category', label: 'Category' },
  { id: 'descriptions', label: 'Descriptions' },
  { id: 'approver', label: 'Approver' },
  { id: 'supervisor', label: 'Supervisor' },
  { id: 'score', label: 'Score' },
  { id: 'status', label: 'Status' },
  { id: 'createdAt', label: 'Created At' },
  { id: '' },
];

const defaultFilters = {
  name: '',
  date: null,
  status: [],
  page: 0,
  size: 10,
  tab: 'mysubmit',
  startDate: null,
  endDate: null,
  textSearch:null,
  sortField: "",
  sortDirection: "asc"
  // selectUI : []
};

// ----------------------------------------------------------------------

export default function ActivitiesView() {
  const theme = useTheme();
  const { user } = useAuthContext();
  const router = useRouter();

  const [tableData, setTableData] = useState(_invoices);
  const [dataStatistic, setDataStatistic] = useState(_invoices);
  const [filters, setFilters] = useState(defaultFilters);
  const [tab, setTab] = useState('mysubmit');
  const [countAll, setCountAll] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();
  const [count, setCount] = useState(0);
  // const [countSupervisor, setCountSupervisor] = useState(0);
  // const [dataSupervisor, setDataSupervisor] = useState();
  // const [filters, setFilters] = useState(defaultFilters);
  const [countApprover, setCountApprover] = useState(0);
  const [dataApprover, setDataApprover] = useState();
  const [filtersApprover, setFiltersApprover] = useState(defaultFilters);
  const [countAdmin, setCountAdmin] = useState(0);
  const [dataAdmin, setDataAdmin] = useState();
  const [summary, setSummary] = useState({
    CONFIRMED: 0,
    APPROVED: 0,
    WAITING: 0,
    REJECT: 0,
    total: 0,
  });
  const [filtersAdmin, setFiltersAdmin] = useState(defaultFilters);
  // const { campaignActivities, isLoading, isError, countAll } = useGetCampaignActivities(page, rowsPerPage, user?.id);

  // dung de get data aff campaign khi vao trang lan dau
  const [loadingPage, setLoadingPage] = useState(false);
  const [summaryTab, setSummaryTab] = useState({
    mySubmitTotal:0,
    needConfirmTotal:0,
    adminTotal:0
  });
  const isInitialRender = useRef(true);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi 1 API để lấy tất cả counts
        const countData = await getCountWaitingConfirm();
        setSummaryTab({
          mySubmitTotal:countData.mySubmitTotal||0,
          needConfirmTotal:countData.needConfirmTotal || 0,
          adminTotal:countData.adminTotal || 0
        });
        // if (countData) {
        //   // setCountAll(countData.mySubmitTotal || 0);
        //   // setCountApprover(countData.needConfirmTotal || 0);
        //   // setCountAdmin(countData.adminTotal || 0);
        // } else {
        //   setCountAll(0);
        //   setCountApprover(0);
        //   setCountAdmin(0);
        // }
  
        setIsLoading(true);
        if (tab === 'mysubmit') {
        const resSum = await getSumary();
        if (resSum != null) {
          setSummary(resSum);
        }

        // console.log(filters);
        const res = await getSubmitList(filters.page, filters.size,filters);
        setTableData(res.data);
        // console.log(res.data)
        setCountAll(res.totalItems);

        } else if (tab === 'approver') {
        const res_ = await getApproverList(filtersApprover.page, filtersApprover.size, filtersApprover);
        const approverData = res_.data;
        if (Array.isArray(approverData) && approverData.length > 0) {
          approverData.forEach((item) => {
            item.createBy = item.userCreate.accountName;
          });
        }
        // console.log(res_.data)
        setDataApprover(res_.data);
        setCountApprover(res_.totalItems);
        }
        // } else if (tab === 'supervisor' && user?.user?.role === "SUPERVISOR") {
        //   const res = await getSupervisorList(filtersSuper.page, filtersSuper.size);
        //   setDataSupervisor(res.data);
        //   setCountSupervisor(res.totalItems);
        // tab === 'admin' &&
        // } else
        // console.log("====user=======");
        // console.log(user);

        if (user?.user?.role === 'ADMIN' && tab === 'admin') {
          const res__ = await getAdminList(filtersAdmin.page, filtersAdmin.size, filtersAdmin);
          // setTableData(res__.data);
          const parsedData = res__.data;
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            parsedData.forEach((item) => {
              item.createBy = item.userCreate.accountName;
            });
          }
          setDataAdmin(res__.data);
          setCountAdmin(res__.totalItems);
        }
  
        isInitialRender.current = false;
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    // console.log("demo===");
    // console.log(filtersAdmin);

    fetchData();
  }, [tab, filters, filtersApprover, filtersAdmin, user]);

  const handleChangePage = useCallback(
    (event, newPage) => {
      setFilters({ ...filters, page: newPage });
      setTableData([]);
    },
    [filters]
  );

  const handlerExport = useCallback(async () => {
    console.log(filtersAdmin)
    const res = await exportData(filtersAdmin);
  }, [filtersAdmin]);

  // useEffect(() => {
  //   const getViewAll = async () => {
  //     const affiliatesData = await getSupervisorList(filters.page, filters.size);
  //     setData(affiliatesData);
  //   }
  //   getViewAll();
  // }, [user])

  const table = useTable({ defaultOrderBy: 'createdAt', defaultOrder: 'desc' });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });



  // const TABS = [
  //   { value: 'mysubmit', label: 'My submit', color: 'default', count: countAll || 0 },
  //   {
  //     value: 'approver',
  //     label: 'Approver',
  //     color: 'success',
  //     count: countApprover || 0,
  //   }
  // ];
  // const baseTabs = [
  //   { value: 'mysubmit', label: 'My submit', color: 'default', count: countAll || 0 },
  //   { value: 'approver', label: 'Approver', color: 'success', count: countApprover || 0 },
  // ];

  // const roleTabs = [];
  // if (user?.user?.role === "SUPERVISOR") {
  //   roleTabs.push({
  //     value: 'supervisor',
  //     label: 'Supervisor',
  //     color: 'warning',
  //     count: countSupervisor || 0,
  //   });
  // }
  // if (user?.user?.role === "ADMIN") {
  //   roleTabs.push({
  //     value: 'admin',
  //     label: 'Admin',
  //     color: 'warning',
  //     count: countAdmin || 0,
  //   });
  // }

  // const TABS = [...baseTabs, ...roleTabs];

  useEffect(() => {
    console.log('Filters changed:', filtersAdmin);
  }, [filtersAdmin]);
  

  const handlerSubmitFilterButton =(localData) =>{
    const keys = Object.keys(localData)
    keys.forEach((key) => {
      // console.log(key,localData[key]);
      if(tab === 'mysubmit'){
        setFilters((prevState) => ({
          ...prevState,
          [key]:localData[key],
        }));
      }
      if(tab === 'approver'){
        setFiltersApprover((prevState) => ({
          ...prevState,
          [key]:localData[key],
        }));
      }
      if(tab === 'admin'){
        setFiltersAdmin((prevState) => ({
          ...prevState,
          [key]:localData[key],
        }));
      }
    })
  }



  const TABS = useMemo(() => {
    // console.log('Calculating TABS, user role:', user);

    const baseTabs = [
      { value: 'mysubmit', label: 'My submisson', color: 'default', count: summaryTab.mySubmitTotal || 0 },
      { value: 'approver', label: 'Need Confirming', color: 'success', count: summaryTab.needConfirmTotal || 0 },
    ];

    if (user?.user?.role === 'ADMIN') {
      baseTabs.push({ value: 'admin', label: 'Admin', color: 'warning', count: summaryTab.adminTotal || 0 });
    }

    return baseTabs;
  }, [countAll, countApprover, countAdmin, user]);

  // useEffect(() => {
  //   if (user?.user?.role === "SUPERVISOR") {
  //     TABS.push({
  //       value: 'supervisor',
  //       label: 'Supervisor',
  //       color: 'warning',
  //       count: countSupervisor || 0,
  //     })
  //   }
  //   if (user?.user?.role === "ADMIN") {
  //     TABS.push({
  //       value: 'admin',
  //       label: 'Admin',
  //       color: 'warning',
  //       count: countAdmin || 0,
  //     });
  //   }
  // }, []);
  // console.log('==TABS=',TABS)
  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  // const handleFilters = useCallback(
  //   (name, value) => {
  //     table.onResetPage();
  //     setFilters((prevState) => ({
  //       ...prevState,
  //       [name]: value,
  //     }));
  //   },
  //   [table]
  // );
  // console.log("==filters=",filters)
  const handleChangeRowsPerPage = useCallback(
    (event) => {
      setFilters({ ...filters, size: event.target.value, page: 0 });
      setTableData([]);
    },
    [filters]
  );

  const canReset = !isEqual(defaultFilters, filters);

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('tab', newValue);
    },
    [handleFilters]
  );
  // const role = ['WAITING', 'APPROVED', 'REJECT', 'CONFIRMED'];
  const role = [
    {
      field: 'WAITTING',
      value: 'WAITING'
    },
    {
      field: 'APPROVED',
      value: 'APPROVED'
    },{
      field: 'CANCELLED',
      value: 'REJECT'
    },{
      field: 'CONFIRMED',
      value: 'CONFIRMED'
    },
    
  ];



  
  // WAITING: 'WAITING',
  //   APPROVED: 'APPROVED',
  //   REJECT: 'CANCELLED',
  //   CONFIRMED: 'CONFIRMED',

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  useEffect(() => { 
    filters.sortField = table.orderBy;
    filters.sortDirection = table.order;
    getSubmitList(filters.page, filters.size,filters).then(res =>{
      setTableData(res?.data);
      setCountAll(res?.totalItems);
    }) 
    
  },[table.order, table.orderBy])

 
  const tabAll = (
    <Box >
      <TableContainer
        sx={{
          flex: 1,
          position: 'relative',
          overflow: 'auto',
          mt: 4,
          alignContent: 'content',
          justifyContent: 'center',
        }}
      >
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={dataFiltered?.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row?.id)
                )
              }
            />
            {isLoading ? (
              loadTable({ numRow: 3, numCol: TABLE_HEAD.length })
            ) : (
              <TableBody>
                {tableData?.length > 0 ? (
                  tableData.map((mysb, index) => (
                    <MysubmitTableRow key={mysb?.id} row={mysb} index={index} table={table} />
                  ))
                ) : (
                  <TableNoData
                    notFound={(dataFiltered?.length > 0 ? dataFiltered : tableData)?.length === 0}
                  />
                )}
              </TableBody>
            )}
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={countAll} // Giả sử này cần thay đổi dựa theo tổng số bản ghi thực tế từ API
        page={filters.page}
        rowsPerPage={filters.size}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {/* <TablePaginationCustom
        count={countAll} // Giả sử này cần thay đổi dựa theo tổng số bản ghi thực tế từ API
        page={page / rowsPerPage}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
      /> */}
    </Box>
  );

  return (
    <Container maxWidth={false} sx={{ width: '90%' }} component={MotionViewport}>
      <Grid container spacing={3}>
        {/* <Grid xs={12} md={8}>
          <CampaignFeatured
            // list={_appFeatured}
            title="Campaign you might like"
          />
        </Grid>

        <Grid xs={12} md={4}>
          <InviteFriends />
        </Grid> */}

        <Grid xs={12} md={12} sx={{ mt: 3 }}>
          <Typography variant="h4" noWrap>
            My Contribute
          </Typography>
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <Card sx={{ mb: { xs: 3, md: 5, backgroundColor: 'rgba(27, 43, 53, 0.9)' } }}>
            <Scrollbar>
              <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
                sx={{ py: 2 }}
              >
                <CommissionAnalytic
                  title="Approved"
                  tooltip="Total number of submit is approved by approver"
                  total={summary?.APPROVED}
                  percent={(Number(summary?.APPROVED) / Number(summary?.total)) * 100}
                  // price={34}
                  icon="solar:file-check-bold-duotone"
                  color={theme.palette.success.main}
                />

                <CommissionAnalytic
                  title="Confirmed"
                  tooltip="The total number of submit is confirmed by supervisor"
                  total={summary?.CONFIRMED}
                  percent={(Number(summary?.CONFIRMED) / Number(summary?.total)) * 100}
                  // price={34}
                  icon="solar:sort-by-time-bold-duotone"
                  color={theme.palette.primary.main}
                />
                <CommissionAnalytic
                  title="Cancelled"
                  total={summary?.REJECT}
                  tooltip="The total campaign is cancelled by supervisor"
                  percent={(Number(summary?.REJECT) / Number(summary?.total)) * 100}
                  // price={12}
                  icon="solar:bill-list-bold-duotone"
                  color={theme.palette.info.main}
                />
                <CommissionAnalytic
                  title="Waiting"
                  tooltip="The total campaign is waiting for process"
                  total={summary?.WAITING}
                  percent={(Number(summary?.WAITING) / Number(summary?.total)) * 100}
                  // price={34}
                  icon="material-symbols-light:pending-actions"
                  color={theme.palette.warning.main}
                />
              </Stack>
            </Scrollbar>
          </Card>
          <Card sx={{ backgroundColor: 'rgba(27, 43, 53, 0.9)' }}>
            <Tabs
              value={filters.tab}
              onChange={handleFilterStatus}
              sx={{
                px: 2.5,
                boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
              }}
            >
              {TABS.map((label) => (
                <Tab
                  key={label.value}
                  value={label.value}
                  label={label.label}
                  iconPosition="end"
                  onClick={() => setTab(label.value)}
                  icon={
                    <Label
                      variant={
                        ((label.value === 'all' || label.value === filters.tab) && 'filled') ||
                        'soft'
                      }
                      color={label.color}
                    >
                      {label.count}
                    </Label>
                  }
                />
              ))}
            </Tabs>

            <FilterTableToolbar
              tab = {tab}
              filters={filters}
              // filtersApprover={filtersApprover}
              // filtersAdmin={filtersAdmin}
              // tab={tab}
              onFilters={handlerSubmitFilterButton}
              roleOptions={role}
              user={user}
              handlerExport={handlerExport}
            />

            {/* {canReset && (
              <SubmitTableFiltersResult
                filters={filters}
                onFilters={handleFilters}
                //
                onResetFilters={handleResetFilters}
                //
                results={dataFiltered.length}
                sx={{ p: 2.5, pt: 0 }}
              />
            )} */}
            {tab === 'mysubmit' && tabAll}

            {tab === 'approver' && (
              <ApproverTable
                data={dataApprover}
                countApp={countApprover}
                filtersApprover={filtersApprover}
                setFiltersApprover={setFiltersApprover}
                user={user}
              />
            )}
            {tab === 'admin' && user?.user?.role === 'ADMIN' && (
              <AdminTable
                data={dataAdmin}
                countAdmin={countAdmin}
                filtersAdmin={filtersAdmin}
                setFiltersAdmin={setFiltersAdmin}
              />
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name, date } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);
  // console.log("===",inputData)
  if (name) {
    inputData = inputData?.filter((activity) =>
      activity.status.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (date) {
    inputData = inputData.filter((activity) =>
      isSameDay(new Date(activity.created_at), new Date(date))
    );
  }

  return inputData;
}
