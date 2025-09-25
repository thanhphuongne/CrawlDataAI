import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { fNumber } from 'src/utils/format-number';

import { bgGradient } from 'src/theme/css';

import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';

// ----------------------------------------------------------------------

const REW_HEAD = [
  { id: 'top', label: 'top', align: 'center' },
  { id: 'reward', label: 'Reward', align: 'center' },
];

const AFF_HEAD = [
  { id: 'level', label: 'Level' },
  { id: 'discount', label: 'Discount', align: 'center' },
  { id: 'provisional', label: 'Provisional', align: 'center' },
  { id: 'explanation', label: 'Explanation', align: 'center' },
];

function transformData(data) {
  return data.map((item) => {
    const { value, index } = item;
    const formattedIndex = formatIndexArray(index);
    return { value, index: formattedIndex };
  });
}

function formatIndexArray(indices) {
  if (indices.length === 0) return [];

  const result = [];
  let start = indices[0];
  let end = indices[0];

  for (let i = 1; i < indices.length; i += 1) {
    if (indices[i] === end + 1) {
      end = indices[i];
    } else {
      result.push(start === end ? `${start}` : `${start} - ${end}`);
      start = indices[i];
      end = indices[i];
    }
  }
  result.push(start === end ? `${start}` : `${start} - ${end}`);
  return result;
}

function groupByValue(data) {
  const result = {};
  // Group indices by value
  data.forEach((item, index) => {
    if (result[item.value]) {
      result[item.value].push(index + 1);
    } else {
      result[item.value] = [index + 1];
    }
  });

  // Create the desired output format and sort by value in descending order
  const output = Object.keys(result)
    .sort((a, b) => b - a)
    .map((key) => ({
      value: key,
      index: result[key],
    }));

  return transformData(output);

  // Hàm này chuyển đổi array trên thành dưới
  // [
  //   { "value": "170000", "index": [1] },
  //   { "value": "127500", "index": [2, 3, 4, 5] },
  //   { "value": "68000", "index": [6, 7, 8, 9,  12, 14, 15, 17, 18, 19, 20] },
  //   { "value": "34000", "index": [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50] }
  // ]

  // [
  //   { "value": "170000", "index": ["1"] },
  //   { "value": "127500", "index": ["2 - 5"] },
  //   { "value": "68000", "index": ["6 - 9",  "12", "14", "15 - 20"] },
  //   { "value": "34000", "index": ["21 - 50"] }
  // ]
}

// ----------------------------------------------------------------------

const BannerItem = ({ title, number, color }) => {
  const theme = useTheme();
  return (
    <Grid xs={6}>
      <Stack
        alignItems="center"
        sx={{
          ...bgGradient({
            direction: '135deg',
            startColor: alpha(theme.palette[color].light, 0.2),
            endColor: alpha(theme.palette[color].main, 0.2),
          }),
          p: 1,
          borderRadius: 2,
          textAlign: 'center',
          color: `${color}.darker`,
          backgroundColor: 'common.white',
        }}
      >
        {/* <Box sx={{ width: 40, height: 40 }}>
          <img alt="icon" src={imgSrc} />
        </Box> */}

        <Typography variant="subtitle2" sx={{ opacity: 0.64 }}>
          {title}
        </Typography>

        <Typography variant="h3">{number}</Typography>
      </Stack>
    </Grid>
  );
};

export default function CampaignRewardPolicy({ rewardPolicy }) {
  const [airdropTableData, setAirdropTableData] = useState([]);

  // console.log("CampaignRewardPolicy: ", rewardPolicy)
  const {
    level,
    // discount,
    airTokenName,
    totalDepositAff,
    your_budget,
    airdrop_prizes,
    dataTopReward,
    affiliates_level,
  } = rewardPolicy;

  useEffect(() => {
    // console.log('CampaignRewardPolicy', totalDepositAff);
    if (dataTopReward && dataTopReward.length > 0) {
      // tổng thưởng nằm trong top
      const totalTopReward = dataTopReward.reduce((acc, curr) => acc + parseInt(curr.value, 10), 0);

      // console.log('totalTopReward: ', totalTopReward)
      // console.log('dataTopReward: ', dataTopReward)

      // số tiền còn lại ko nằm trong top
      const remainRewardBudget = your_budget - totalTopReward;
      // số người có thể nhận thưởng còn lại
      const remainReward = airdrop_prizes - dataTopReward.length;

      const rewardPolicyList = groupByValue(dataTopReward);

      // vẫn còn tiền thì chia đều cho những đứa ko nằm trong top
      if (remainRewardBudget > 0 && remainReward > 0) {
        // số phần thưởng còn lại
        rewardPolicyList.push({
          value: remainRewardBudget / remainReward,
          index: [`${(dataTopReward.length + 1).toString()} - ${airdrop_prizes}`],
        });
      }

      setAirdropTableData(rewardPolicyList);
    }
  }, [dataTopReward, airdrop_prizes, your_budget]);

  return (
    <Stack spacing={1}>
      <Grid sx={{ mb: 1 }} container spacing={2}>
        <BannerItem
          title="Campaign budget"
          number={`${fNumber(your_budget)} ${airTokenName}`}
          imgSrc="/assets/icons/glass/ic_glass_bag.png"
          color="info"
        />
        <BannerItem
          title="Number of prizes"
          number={fNumber(airdrop_prizes)}
          imgSrc="/assets/icons/glass/ic_glass_users.png"
          color="info"
        />

        {dataTopReward && dataTopReward.length > 0 && (
          <Grid xs={12} sm={12} md={12}>
            <Card>
              <TableContainer>
                <Scrollbar>
                  <Table sx={{}} size="small">
                    <TableHeadCustom headLabel={REW_HEAD} />

                    <TableBody>
                      {airdropTableData.map((row) => (
                        <TableRow key={row.level}>
                          <TableCell align="center">
                            <Typography variant="caption">{row.index.join(', ')}</Typography>
                          </TableCell>

                          <TableCell align="center">
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 'fontWeightSemiBold', color: 'primary.main' }}
                            >
                              {fNumber(row.value)} ${airTokenName}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>
            </Card>
          </Grid>
        )}
      </Grid>
      {totalDepositAff > 0 && <Divider sx={{ borderStyle: 'dashed' }} />}

      {totalDepositAff > 0 && (
        <Grid sx={{ mt: 1 }} container spacing={2}>
          <BannerItem
            title="Affiliates Budget"
            number={`${fNumber(totalDepositAff)} ${airTokenName}`}
            imgSrc="/assets/icons/glass/ic_glass_users.png"
            color="warning"
          />
          <BannerItem
            title="Affiliates Level"
            number={affiliates_level}
            imgSrc="/assets/icons/glass/ic_glass_users.png"
            color="warning"
          />
          <Grid xs={12} sm={12} md={12}>
            <Card sx={{ mt: 1 }}>
              <TableContainer>
                <Scrollbar>
                  <Table sx={{}} size="small">
                    <TableHeadCustom headLabel={AFF_HEAD} />

                    <TableBody>
                      {level.map((row) => (
                        <TableRow key={row.level}>
                          <TableCell align="center">
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 'fontWeightSemiBold', color: 'primary.main' }}
                            >
                              {row.level}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 'fontWeightSemiBold', color: 'primary.main' }}
                            >
                              {row.discount}%
                            </Typography>
                          </TableCell>

                          <TableCell align="right">
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 'fontWeightSemiBold', color: 'primary.main' }}
                            >
                              {row.provisional} ${airTokenName}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography variant="caption" sx={{ fontSize: 11 }}>
                              {row.explanation}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      )}
    </Stack>
  );
}

CampaignRewardPolicy.propTypes = {
  rewardPolicy: PropTypes.object,
};

BannerItem.propTypes = {
  title: PropTypes.string,
  number: PropTypes.string,
  // imgSrc: PropTypes.string,
  color: PropTypes.string,
};
