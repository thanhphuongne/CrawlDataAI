import { useState } from 'react';
// import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';

export function connectTonWallet() {
  const [loadingConnect, setLoadingConnect] = useState(false);
  // const [tonConnectUI] = useTonConnectUI();
  const searchParams = useSearchParams();
  const { updateUserDispath } = useAuthContext();
  const router = useRouter();
  // const wallet = useTonWallet();
  const connect = () => {
    // if (tonConnectUI.connected) {
    //   tonConnectUI.disconnect();
    // }
    // setLoadingConnect(true);
    // tonConnectUI
    //   .connectWallet()
    //   .then(async (res) => {
    //     const data = {
    //       ref_code: searchParams.get('xoffer') || '',
    //       public_address: toUserFriendlyAddress(res.account.address, ConfigTon.chain === 'testnet'),
    //       device_token: '',
    //       type_wallet: 1,
    //     };
    //     const response = await loginByTon(data);
    //     if (response) {
    //       // const returnTo = searchParams.get('returnTo') || '/';
    //       updateUserDispath(response.data);
    //       // window.location.href = returnTo
    //       // router.push(returnTo);
    //       setTimeout(() => {
    //         setLoadingConnect(false);
    //       }, 2000);
    //     } else {
    //       setLoadingConnect(false);
    //     }
    //   })
    //   .catch((error) => {
    //     enqueueSnackbar(error.message?.replace('[TON_CONNECT_SDK_ERROR]', ''), {
    //       variant: 'error',
    //     });
    //     setLoadingConnect(false);
    //   });
  };
  const disconnect = () => {
    // if (wallet?.account) {
    //   tonConnectUI.disconnect();
    // }
  };

  return { loadingConnect, connect, disconnect };
}

export function addWalletLink() {
  const [loadingConnectTon, setLoadingConnect] = useState(false);
  // const [tonConnectUI] = useTonConnectUI();
  const { updateDispath } = useAuthContext();
  const connectTon = () => {
    // if (tonConnectUI.connected) {
    //   tonConnectUI.disconnect();
    // }
    // setLoadingConnect(true);
    // tonConnectUI
    //   .connectWallet()
    //   .then(async (res) => {
    //     const data = {
    //       public_address: toUserFriendlyAddress(res.account.address, ConfigTon.chain === 'testnet'),
    //     };
    //     const response = await tonWalletLink(data);
    //     if (response.data) {
    //       updateDispath();
    //     }
    //     setTimeout(() => {
    //       setLoadingConnect(false);
    //     }, 1000);
    //   })
    //   .catch((error) => {
    //     enqueueSnackbar('Wallet was not connected.', { variant: 'error' });
    //     setTimeout(() => {
    //       setLoadingConnect(false);
    //     }, 1000);
    //   });
  };
  const disconnect = async (id, address) => {
    // setLoadingConnect(true);
    // const userData = window.localStorage.getItem('user');

    // const data = {
    //   id: id,
    // };
    // if ((JSON.parse(userData).public_address === address && JSON.parse(userData).email) === null) {
    //   enqueueSnackbar('Can not disconnect.');
    //   setTimeout(() => {
    //     setLoadingConnect(false);
    //   }, 1000);
    // } else {
    //   const response = await unlinkWalletLink(data);
    //   if (response.data) {
    //     updateDispath();
    //     enqueueSnackbar('Disconnect succesfully.');
    //   }
    //   setTimeout(() => {
    //     setLoadingConnect(false);
    //   }, 1000);
    // }
  };

  return { loadingConnectTon, connectTon, disconnect };
}
