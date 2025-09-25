import Web3 from 'web3';
import { enqueueSnackbar } from 'notistack';
import { useState, useCallback } from 'react';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { endpoints } from 'src/utils/axios';

import { HOST_API } from 'src/config-global';
import { useAuthContext } from 'src/auth/hooks';
import { handleAuthWallet, genSignWalletLink } from 'src/api/wallet-links-api';

const environment = {
  api: HOST_API,
  webMobile: 'app.xoffer.io',
  chainId: '0x13882', // Change to your chain ID
  rpc: 'https://rpc-amoy.polygon.technology', // Change to your RPC URL
  chainName: 'Amoy',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  blockExplorerUrls: ['https://www.oklink.com/amoy/'],
};

const handleSignMessage = async (web3, { public_address, nonce }) => {
  try {
    const signature = await web3.eth.personal.sign(nonce, public_address, '');
    return { public_address, signature };
  } catch (err) {
    throw new Error('You need to sign the message to be able to log in.');
  }
};

const handleSignup = async (public_address) => {
  const res = await fetch(environment.api + endpoints.auth.userInfo, {
    body: JSON.stringify({ public_address }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error('Failed to sign up: ' + errorText);
  }
  return res.json();
};

export async function connectMetaMaskTest(ref_code) {
  try {
    // setLoadingConnect(true);

    if (!window.ethereum) {
      if (/Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.location.href = 'https://metamask.app.link/dapp/' + environment.webMobile;
        return;
      } else {
        alert('Please install MetaMask');
        return;
      }
    }

    const { ethereum } = window;

    // Request account access if needed
    await ethereum.request({ method: 'eth_requestAccounts' });

    const web3 = new Web3(ethereum);

    const chainId = await web3.eth.getChainId();
    if (!chainId) {
      alert('Cannot retrieve network. Please refresh the browser.');
      return;
    } else {
      const hexNumber = '0x' + parseInt(chainId.toString()).toString(16);
      if (hexNumber !== environment.chainId) {
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: environment.chainId }],
          });
        } catch (error) {
          if (error.code === 4902 || error.code === -32603 || error.code === 32603) {
            try {
              await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: environment.chainId,
                    rpcUrls: [environment.rpc],
                    chainName: environment.chainName,
                    nativeCurrency: environment.nativeCurrency,
                    blockExplorerUrls: environment.blockExplorerUrls,
                  },
                ],
              });
            } catch (addError) {
              console.error(addError);
              return;
            }
          } else {
            console.error(error);
            return;
          }
        }
      }
    }

    const accounts = await web3.eth.getAccounts();

    if (!accounts[0]) {
      // alert('Please activate MetaMask first.');
      return;
    }
    const public_address = accounts[0].toLowerCase();

    // Look if user with current publicAddress is already present on backend
    const res = await fetch(environment.api + '/users-gen', {
      body: JSON.stringify({ ref_code, public_address, device_token: '' }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    const users = await res.json();
    const user = users.length ? users[0] : await handleSignup(public_address);

    const { signature } = await handleSignMessage(web3, { public_address, nonce: user.nonce });

    return { signature, public_address };
  } catch (error) {
    console.error('MetaMask login error:', error);
  }
  // finally {
  // }
}

export function useMetaMaskLogin() {
  const [loadingConnect, setLoadingConnect] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { updateDispath } = useAuthContext();
  const setSession = (token) => {
    if (token) {
      localStorage.setItem('accessToken', token);
      // Set any other session data here
    } else {
      localStorage.removeItem('accessToken');
      // Remove any other session data here
    }
  };

  const connectMetaMask = useCallback(async (data, redirectURL, callback) => {
    try {
      setLoadingConnect(true);

      if (!window.ethereum) {
        if (/Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          window.location.href = 'https://metamask.app.link/dapp/' + environment.webMobile;
          return;
        } else {
          alert('Please install MetaMask');
          return;
        }
      }

      const { ethereum } = window;

      // Request account access if needed
      await ethereum.request({ method: 'eth_requestAccounts' });

      const web3 = new Web3(ethereum);

      const chainId = await web3.eth.getChainId();
      if (!chainId) {
        alert('Cannot retrieve network. Please refresh the browser.');
        return;
      } else {
        const hexNumber = '0x' + parseInt(chainId.toString()).toString(16);
        if (hexNumber !== environment.chainId) {
          try {
            await ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: environment.chainId }],
            });
          } catch (error) {
            if (error.code === 4902 || error.code === -32603 || error.code === 32603) {
              try {
                await ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: environment.chainId,
                      rpcUrls: [environment.rpc],
                      chainName: environment.chainName,
                      nativeCurrency: environment.nativeCurrency,
                      blockExplorerUrls: environment.blockExplorerUrls,
                    },
                  ],
                });
              } catch (addError) {
                console.error(addError);
                return;
              }
            } else {
              console.error(error);
              return;
            }
          }
        }
      }

      const accounts = await web3.eth.getAccounts();

      if (!accounts[0]) {
        // alert('Please activate MetaMask first.');
        return;
      }
      const public_address = accounts[0].toLowerCase();

      // Look if user with current publicAddress is already present on backend
      const res = await fetch(environment.api + endpoints.auth.loginGoogle, {
        body: JSON.stringify({ ref_code: data.ref_code, public_address, device_token: '' }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      const users = await res.json();
      const user = users.length ? users[0] : await handleSignup(public_address);

      const { signature } = await handleSignMessage(web3, { public_address, nonce: user.nonce });

      return { signature, public_address };
      // callback({ signature, public_address });

      // const authResponse = await handleAuthenticate(public_address, signature, data.ref_code);
      // if (authResponse) {
      //   const queryString = window.location.href;
      //   const path = new URL(queryString).pathname;
      //   const returnTo = path === '/login' ? paths.activities : path || paths.activities;

      //   window.localStorage.setItem('user', JSON.stringify(authResponse.data));

      //   const dataRes = authResponse.data;

      //   const userInfo = authResponse.data;

      //   console.log({ userInfo, returnTo });
      //   // console.log(userInfo);

      //   // setSession(authResponse.token, '3', userInfo?.agents[0].vendor_id || '');
      //   setSession(authResponse.token);
      //   // window.location.href = returnTo;
      //   router.push(returnTo);
      //   callback(true);
      //   console.log('userInfo');
      // } else {
      //   alert('MetaMask login failed');
      //   callback(false);
      // }
    } catch (error) {
      console.error('MetaMask login error:', error);
      // alert('MetaMask login was not successful');
      callback(false);
    } finally {
      setLoadingConnect(false);
    }
  }, []);

  const handleAuthenticate = async (public_address, signature, ref_code) => {
    const response = await fetch(environment.api + 'auth-user', {
      body: JSON.stringify({ public_address, signature, ref_code }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('Failed to authenticate: ' + errorText);
    }
    return response.json();
  };

  // link to Metamask Wallet
  const linkMetaMask = async () => {
    try {
      setLoadingConnect(true);
      if (!window.ethereum) {
        if (/Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          window.location.href = 'https://metamask.app.link/dapp/' + environment.webMobile;
          return;
        } else {
          alert('Please install MetaMask');
          return;
        }
      }

      const { ethereum } = window;
      // Request account access if needed
      await ethereum.request({ method: 'eth_requestAccounts' });
      const web3 = new Web3(ethereum);
      const chainId = await web3.eth.getChainId();

      if (!chainId) {
        alert('Cannot retrieve network. Please refresh the browser.');
        return;
      } else {
        const hexNumber = '0x' + parseInt(chainId.toString()).toString(16);
        if (hexNumber !== environment.chainId) {
          try {
            await ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: environment.chainId }],
            });
          } catch (error) {
            if (error.code === 4902 || error.code === -32603 || error.code === 32603) {
              try {
                await ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: environment.chainId,
                      rpcUrls: [environment.rpc],
                      chainName: environment.chainName,
                      nativeCurrency: environment.nativeCurrency,
                      blockExplorerUrls: environment.blockExplorerUrls,
                    },
                  ],
                });
              } catch (addError) {
                console.error(addError);
                return;
              }
            } else {
              console.error(error);
              return;
            }
          }
        }
      }

      const accounts = await web3.eth.getAccounts();
      if (!accounts[0]) {
        alert('Please activate MetaMask first.');
        return;
      }
      const public_address = accounts[0].toLowerCase();
      const res = await genSignWalletLink({ public_address: public_address });
      const user = res.data;
      const { signature } = await handleSignMessage(web3, { public_address, nonce: user.nonce });
      const data = { public_address: public_address, signature: signature }
      const authResponse = await handleAuthWallet(data);
      updateDispath();
      setTimeout(() => {
        setLoadingConnect(false);
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        setLoadingConnect(false);
      }, 1000);
    }
  };

  // get account connect
  const getAccount = async () => {
    if (!window.ethereum) {
      if (/Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.location.href = 'https://metamask.app.link/dapp/' + environment.webMobile;
        return;
      } else {
        alert('Please install MetaMask');
        return;
      }
    }
    const { ethereum } = window;
    const web3 = new Web3(ethereum);
    try {
      const acc = await web3.eth.getAccounts();
      return acc;
    } catch (error) {
      return []
    }
  }

  // connect to Metamask Wallet
  const reconnectMetaMask = async () => {
    try {
      setLoadingConnect(true);
      if (!window.ethereum) {
        if (/Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          window.location.href = 'https://metamask.app.link/dapp/' + environment.webMobile;
          return false;
        } else {
          alert('Please install MetaMask');
          return false;
        }
      }

      const { ethereum } = window;
      // Request account access if needed
      await ethereum.request({ method: 'eth_requestAccounts' });
      const web3 = new Web3(ethereum);
      const chainId = await web3.eth.getChainId();

      if (!chainId) {
        alert('Cannot retrieve network. Please refresh the browser.');
        return false;
      } else {
        const hexNumber = '0x' + parseInt(chainId.toString()).toString(16);
        if (hexNumber !== environment.chainId) {
          try {
            await ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: environment.chainId }],
            });
          } catch (error) {
            if (error.code === 4902 || error.code === -32603 || error.code === 32603) {
              try {
                await ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: environment.chainId,
                      rpcUrls: [environment.rpc],
                      chainName: environment.chainName,
                      nativeCurrency: environment.nativeCurrency,
                      blockExplorerUrls: environment.blockExplorerUrls,
                    },
                  ],
                });
              } catch (addError) {
                enqueueSnackbar(addError.message, { variant: 'error' });
                return false;
              }
            } else {
              enqueueSnackbar(error.message, { variant: 'error' });
              return false;
            }
          }
        }
      }
      const accounts = await web3.eth.getAccounts();
      if (!accounts[0]) {
        alert('Please activate MetaMask first.');
        return false;
      }
      return true;
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      return false;
    }
  };
  return { loadingConnect, connectMetaMask, linkMetaMask, getAccount, reconnectMetaMask };
}
