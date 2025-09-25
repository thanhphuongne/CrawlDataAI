import axios from 'axios';

import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};
// ----------------------------------------------------------------------

export const endpoints = {
  public: {
    hotCampaigns: '/public/shares/hot-and-recommend',
    srcRanking: '/submit-request/ranking',
  },
  quest: {
    previewProductPost: '/campaigns/get-product-review-post/',
  },
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/users/me',
    login: '/users/login',
    users: '/users',
    register: '/users/registry',
    verify: '/confirm-mail',
    sendMail: '/verify-register-mail',
    getRef: '/get-user',
    loginTon: '/login-ton',
    updateStatusClaimQuest: '/campaigns/update-claim',
    updateStatusClaimReferal: '/orders/update-status-claim',
    tonWalletLink: '/auth-ton-public-address',
    unlinkWallet: '/unlink-wallet',
    genSign: '/gen-sign-wallet-nonce',
    authPublic: '/auth-public-address',
    loginUser: '/login-user',
    loginGoogle: '/login-google-next',
    loginMetaMask: '/auth-user',
    userInfo: '/users-info',
    isJoined: '/campaigns/check-mission',
    submitJoin: '/campaigns/execute-mission',
    submitQuest: '/campaigns/execute-quest',
    loginTelegram: '/login-telegram',
    supervisors: '/users/list-supervisors'
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  submitRequest: {
    create: '/submit-request',
    list: '/submit-request/list?',
    supervisorList: '/submit-request/list-assign',
    supervisorApprove: '/submit-request/supervisor-approve',
    ApproverList: '/submit-request/list-approver',
    ApproverAprove: '/submit-request/approver-approve',
    AdminList: '/submit-request/list-all',
    AdminAprove: '/submit-request/admin-approve',
    exportData: '/submit-request/export-data',
    comment: '/submit-request/comment',
    summary: '/submit-request/summary',
    countAll: 'submit-request/count-waiting-confirm'
  },
  category: {
    path: '/categories'
  },
  campaign: {
    list: '/campaigns/search',
    details: '/campaigns/',
    questList: '/campaigns/get-quests-no-authen/',
    questListAuthen: '/campaigns/get-quests/',
    leaderboard: '/campaigns/leaderboard',
    search: '/api/product/search',
    activities: '/campaigns/join-campaign',
    // activities: '/campaigns/joins-campaign',
    traffics: '/amountClick',
    shares: '/shares',
    shortLinks: '/shortLinks',
    checkCompletedQuest: '/campaigns/check-user-complete',
    bookmark: '/my-bookmark',
    setBookmark: '/bookmark',
    affiliates: '/affiliates/{id}/networks',
    statisticCampaign: '/get-statistic-campaign',
    campaignAff: '/get-campaign-aff',
    getBookmarkList: '/get-bookmark-list',
    activitiesCount: '/activities-count',
  },
  upload: {
    file: '/media?width=&height=',
  },
  social: {
    link: '/link',
    check: '/check',
    disconnect: '/disable',
  },
  user: {
    updateInfo: '/users/{id}/profile-v1',
    verifyEmail: '/users/{id}/verify-email-v1',
    uploadImage: '/media?width=500&height=',
    updateImage: '/users/{id}/avatar',
    resetPassWord: '/reset-password',
    updatePassWord: '/users/password',
    forgotPassWord: 'users/forgot-password',
    verifyCode: '/users/verify-code',
    rewardHistory: '{id}/reward-histories',
    rewardSummary: 'users/{id}/membership-summary?skip={skip}&limit={limit}&status={status}',
    rewardGuide: '{id}/rewards-guide',
    packages: '/packages',
    upgradeLevel: '/subscription/upgrade-level',
    resetLevelMemberShip: 'subscription/reset-level',
    rewardEarneds: '{id}/reward-earneds/13',
    networkRef: 'affiliates/{id}/networks?skip={skip}&limit={limit}',
  },
};
