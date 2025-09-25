'use client';

import { m } from 'framer-motion';
import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { alpha, styled } from '@mui/material/styles';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import axios, { endpoints } from 'src/utils/axios';

import MainLayout from 'src/layouts/main';
import {
  MONTHS,
  Quarter,
} from 'src/_mock';
import { bgGradient, textGradient } from 'src/theme/css';

import { useSettingsContext } from 'src/components/settings';

import RankingList from '../Ranking-list'
// import CampaignSearch from '../campaign-search';
import RankingFilters from '../Ranking-filters';
import RankingFiltersResult from '../ranking-filters-result';
// import { filter } from 'lodash';
// import { margin } from '@mui/system';

// ----------------------------------------------------------------------

const defaultFilters = {
  quarter: null,
  month: null,
  startDate: null,
  endDate: null
};

// ----------------------------------------------------------------------

export default function RankingListView() {
  // dựa vào showBreadcrumbs để biết đang ở home hay search
  const mdUp = useResponsive('up', 'md');

  const settings = useSettingsContext();

  // const [loading, setLoading] = useState(true);
  const [rankingls, setRankingls] = useState();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [count, setTotalCount] = useState(0);

  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('latest');

  const [search, setSearch] = useState({
    query: '',
    results: [],
  });

  const [filters, setFilters] = useState(defaultFilters);
  const getCurrentMonthFirstAndLastDay = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1); // Ngày đầu tiên của tháng
    const lastDay = new Date(year, month + 1, 0); // Ngày cuối cùng của tháng

    // Format ngày theo YYYY-MM-DD (không bị ảnh hưởng bởi múi giờ)
    const formatDate = (date) => {
      const year_ = date.getFullYear();
      const month_ = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
      const day = String(date.getDate()).padStart(2, '0');
      return `${year_}-${month_}-${day}`;
    };

    return {
      firstDay: formatDate(firstDay),
      lastDay: formatDate(lastDay),
    };
  };

  const getValueByLabel = (quarter_, label) => {
    const quarter = quarter_.find(q => q.label === label);
    return quarter ? quarter.value : null; // Return null if not found
  };
  function getStartAndEndDates(quarter) {
    const currentYear = new Date().getFullYear(); // Lấy năm hiện tại
    const quarters = {
      1: { start: '01-01', end: '03-31' },
      2: { start: '04-01', end: '06-30' },
      3: { start: '07-01', end: '09-30' },
      4: { start: '10-01', end: '12-31' },
    };

    const selectedQuarter = quarters[quarter];
    if (!selectedQuarter) {
      return null; // Trả về null nếu quý không hợp lệ
    }

    return {
      startDate: `${currentYear}-${selectedQuarter.start}`,
      endDate: `${currentYear}-${selectedQuarter.end}`,
    };
  }
  const getStartAndEndDatesOfMonth = (month) => {
    const currentYear = new Date().getFullYear(); // Lấy năm hiện tại

    if (month < 1 || month > 12) {
      return null; // Trả về null nếu tháng không hợp lệ
    }

    // Ngày đầu tiên của tháng
    const startDate = new Date(currentYear, month - 1, 1);
    startDate.setDate(startDate.getDate() + 1); // Thêm 1 ngày

    // Ngày cuối cùng của tháng
    const endDate = new Date(currentYear, month, 0);
    endDate.setDate(endDate.getDate() + 1); // Thêm 1 ngày

    return {
      startDate: startDate.toISOString().split('T')[0], // Định dạng YYYY-MM-DD
      endDate: endDate.toISOString().split('T')[0],    // Định dạng YYYY-MM-DD
    };
  }
  useEffect(() => {
    const fetchData = async () => {
      // const { firstDay, lastDay } = getCurrentMonthFirstAndLastDay();
      // let startD = firstDay;
      // let endD = lastDay;
      // // if (filters.quarter) {
      //   const quarter_ = getValueByLabel(Quarter, filters.quarter);
      //   const { startDate, endDate } = getStartAndEndDates(quarter_)
      //   startD = startDate;
      //   endD = endDate;
      // }
      // if (filters.month) {
      //   const month_ = getValueByLabel(MONTHS, filters.month);
      //   const { startDate, endDate } = getStartAndEndDatesOfMonth(month_)
      //   startD = startDate;
      //   endD = endDate;

      // }


      try {
        let url = endpoints.public.srcRanking + '?pagenumber=' + page + '&pagesize=' + size;
        if (filters.startDate != null && filters.endDate != null && filters.startDate <= filters.endDate) {
          const _startDate = new Date(filters.startDate).toISOString().split('T')[0];
          const _endDate = new Date(filters.endDate).toISOString().split('T')[0];
          url += "&startdate=" + _startDate + "&enddate=" + _endDate
        }
        const response = await axios.get(url);
        // console.log("response sau trigger: ", response.data)
        let tmpCampaigns = response.data.data;
        setTotalCount(response.data.totalItems);
        // console.log("tmpCampaigns: ", tmpCampaigns)
        setRankingls(tmpCampaigns);
        // setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [page, size, filters]);

  const dataFiltered = applyFilter({
    inputData: rankingls || [],
    filters,
    sortBy,
  });

  const changePageAndSize = (_page, _size) => {
    setPage(_page);
    setSize(_size);
  };
  const canReset = !isEqual(defaultFilters, filters);

  const notFound = !dataFiltered?.length && canReset;

  const handleFilters = useCallback((name, value) => {
    // console.log("=====name, value=====", name, value);

    // Dynamically update filters based on the selected name
    setFilters((prev) => ({
      ...prev,
      [name]: value, // Update the current filter
      // ...(name === "month" ? { quarter: null } : { month: null }) // Reset the other filter
    }));
    // console.log("=====name, values=====", name, value);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback(
    (inputValue) => {
      setSearch((prevState) => ({
        ...prevState,
        query: inputValue,
      }));

      if (inputValue) {
        const results = [];
        // const results = _jobs.filter(
        //   (job) => job.title.toLowerCase().indexOf(search.query.toLowerCase()) !== -1
        // );

        // const results = campaigns.filter(
        //   (campaign) => campaign.name.toLowerCase().indexOf(search.query.toLowerCase()) !== -1
        // );

        setSearch((prevState) => ({
          ...prevState,
          results,
        }));
      }
    },
    []
    // [search.query]
  );

  const renderFilters = (
    <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      spacing={1}
    >
      {(
        <Stack
          direction="row"
          spacing={1}
          flexShrink={0}
          justifyContent="flex-end"
          sx={{ width: { xs: 1, sm: 1, md: 1 } }}
        >
          <RankingFilters
            // sx={{ position: 'absolute', marginLeft: 50 }}
            open={openFilters.value}
            onOpen={openFilters.onTrue}
            onClose={openFilters.onFalse}
            filters={filters}
            onFilters={handleFilters}
            canReset={canReset}
            onResetFilters={handleResetFilters}
            quarter={Quarter.map((option) => option.label)}
            months={MONTHS.map((option) => option.label)}
          />
        </Stack>
      )}
    </Stack>
  );

  const renderResults = (
    <RankingFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={count}
    />
  );
  const StyledRoot = styled('div')(({ theme }) => ({
    ...bgGradient({
      color: alpha(theme.palette.background.default, theme.palette.mode === 'light' ? 0.9 : 0.94),
      imgUrl: '/assets/background/overlay_3.jpg',
    }),
    marginTop: '70px',
    // padding: '40px 0 ',
    paddingTop: '20px',
    // width: '100%',
    // height: '100vh',
    // position: 'relative',
    // [theme.breakpoints.up('md')]: {
    //   top: 0,
    //   left: 0,
    //   position: 'fixed',
    // },
  }));
  const StyledTextGradient = styled(m.h1)(({ theme }) => ({
    ...textGradient(
      `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 25%, ${theme.palette.primary.main} 50%, ${theme.palette.warning.main} 75%, ${theme.palette.primary.main} 100%`
    ),
    // display: 'inline',
    paddingBottom: 8,
    marginTop: 8,
    lineHeight: 1,
    fontWeight: 800,
    // marginBottom: 24,
    // letterSpacing: 8,
    textAlign: 'center',
    backgroundSize: '400%',
    fontSize: '1.5rem',
    fontFamily: theme.typography.fontSecondaryFamily,
    [theme.breakpoints.up('md')]: {
      fontSize: `4rem`,
    },
  }));
  return (
    <MainLayout>
      <Container
        sx={{ mt: { xs: 10, sm: 15, md: 15 } }}
        disableGutters={mdUp}
        maxWidth={settings.themeStretch ? false : 'lg'}
      >


        <StyledTextGradient
          animate={{ backgroundPosition: '200% center' }}
          transition={{
            repeatType: 'reverse',
            ease: 'linear',
            duration: 20,
            repeat: Infinity,
          }}
          sx={{ fontSize: { xs: 38 } }}
        >
          QAI Scoring Contribute Point
        </StyledTextGradient>
        <Stack>
          <Box
            component="img"
            src="/assets/img_reward_logo.png"
            sx={{ width: 220, cursor: 'pointer', textAlign: 'center', margin: 'auto' }}
          />
        </Stack>
        <Stack
          spacing={2.5}
          sx={{
            mb: { xs: 3, md: 2 },
          }}
          justifyContent="flex-end"
        >
          {renderFilters}

          {/* {canReset && renderResults} */}
        </Stack>

        {/* {notFound && <EmptyContent filled title="No Data" sx={{ py: 10 }} />} */}

        {/* Nếu ở home thì lấy data listAllHomeView còn ở search thì lấy data dataFiltered */}
        <Stack sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' , borderRadius:'18px'}}>
          <RankingList
            rankings={dataFiltered}
            changePageAndSize={changePageAndSize}
            page={page}
            size={size}
            totalCount={count}
          />
        </Stack>

      </Container>
    </MainLayout>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({ inputData, filters, sortBy }) => {
  // console.log(`inputData: `, inputData)
  // console.log(`filters: `, filters)
  const {
    campaignTypes,
    chains,
    month,
    // roles,
    locations,
    benefits,
  } = filters;

  // SORT BY
  // if (sortBy === 'latest') {
  //   inputData = orderBy(inputData, ['created_at'], ['desc']);
  //   // console.log(`inputData: `, inputData);
  // }

  // if (sortBy === 'oldest') {
  //   inputData = orderBy(inputData, ['created_at'], ['asc']);
  // }

  // if (sortBy === 'popular') {
  //   inputData = orderBy(inputData, ['totalViews'], ['desc']);
  // }

  // FILTERS
  // if (campaignTypes.length) {
  //   inputData = inputData.filter((campaign) =>
  //     // campaign.type_id.some((item) => campaignTypes.includes(item))
  //     campaignTypes.includes(campaign.type)
  //   );
  // }

  // // if (experience !== 'all') {
  // //   inputData = inputData.filter((job) => job.experience === experience);
  // // }

  // if (chains.length) {
  //   inputData = inputData.filter((campaign) => chains.includes(campaign.step_reward_policy.chain));
  // }

  // if (roles.length) {
  //   inputData = inputData.filter((job) => roles.includes(job.role));
  // }

  // if (categories.length) {
  //   inputData = inputData.filter((campaign) =>
  //     categories.includes(campaign.step_info_general.category)
  //   );
  // }

  // if (locations.length) {
  //   inputData = inputData.filter((job) => job.locations.some((item) => locations.includes(item)));
  // }

  // if (benefits.length) {
  //   inputData = inputData.filter((job) => job.benefits.some((item) => benefits.includes(item)));
  // }

  return inputData;
};
