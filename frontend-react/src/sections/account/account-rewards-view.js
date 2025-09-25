import { useState } from 'react';
import { useTheme } from '@emotion/react';

import { alpha, Container } from '@mui/system';
import { Tab, Box, Card, Tabs } from '@mui/material';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import AccountRewardGuide from './account-reward-guide';
import AccountRewardHistory from './account-reward-history';

export default function AccountRewardsView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('history');

  const TABS = [
    { value: 'history', label: 'History', icon: <Iconify icon="material-symbols:history" width={24} /> },
    { value: 'guide', label: 'Reward Guide', icon: <Iconify icon="mingcute:trophy-fill" width={24} /> },
    // { value: 'summary', label: 'Summary', icon: <Iconify icon="streamline:task-list" width={24} /> },
  ];

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mb: 5 }}>
      <Box>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            mb: 3,
            // px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} icon={tab.icon} />
          ))}
        </Tabs>
        <Card>
          {currentTab === 'history' && <AccountRewardHistory />}
          {currentTab === 'guide' && <AccountRewardGuide />}
          {/* {currentTab === 'summary' && <AccountRewardSummary />} */}
        </Card>

      </Box>
    </Container>
  );
}
