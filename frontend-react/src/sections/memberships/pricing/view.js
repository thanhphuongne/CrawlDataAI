'use client';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import PricingCard from './pricing-card';

// ----------------------------------------------------------------------

export default function PricingMemberShipView({ packageData, user }) {
  return (
    <Container
      sx={{
        pt: 5,
        pb: 5,
        minHeight: 1,
      }}
      style={{paddingLeft: '0px', paddingRight: '0px'}}
    >
      <Box
        gap={{ xs: 3, md: 0 }}
        display="grid"
        alignItems={{ md: 'center' }}
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
      >
        {_pricingPlans.map((card, index) => (
          <PricingCard packageData={packageData} user={user} key={card.subscription} card={card} index={index} />
        ))}
      </Box>
    </Container>
  );
}

export const _pricingPlans = [
  {
    subscription: 'basic',
    id: 4,
    price: 0,
    caption: 'Forever',
    lists: ['XO Daily Rewards', 'xPoint Multipliers ', 'Launchpad Allocations'],
    labelAction: 'Free',
  },
  {
    subscription: 'plus',
    price: 200,
    id: 1,
    caption: 'Saving $24 a year',
    lists: ['XO Daily Rewards', 'xPoint Multipliers ', 'Launchpad Allocations', 'Priority on Hot Offers'],
    labelAction: 'Get Plus',
  },
  {
    subscription: 'premium',
    price: 400,
    id: 2,
    caption: 'Saving $124 a year',
    lists: ['XO Daily Rewards', 'xPoint Multipliers ', 'Launchpad Allocations', 'Priority on Hot Offers', 'Fixed-Membership Rewards'],
    labelAction: 'Get Premium',
  },
  {
    subscription: 'platinum',
    price: 600,
    id: 3,
    caption: 'Saving $124 a year',
    lists: ['XO Daily Rewards', 'xPoint Multipliers ', 'Launchpad Allocations', 'Priority on Hot Offers', 'Fixed-Membership Rewards', 'Participate in Airdrop Campaigns'],
    labelAction: 'Get Platinum',
  },
];

PricingMemberShipView.propTypes = {
  packageData: PropTypes.any,
  user: PropTypes.object,
};