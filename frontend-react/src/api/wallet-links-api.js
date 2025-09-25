import { enqueueSnackbar } from 'notistack';

import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

// add ton wallet
export async function tonWalletLink(public_address) {
    const url = endpoints.auth.tonWalletLink;
    try {
        const response = await axios.post(url, public_address);
        return response;
    } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return null;
    }
}

// unlink ton wallet
export async function unlinkWalletLink(id) {
    const url = endpoints.auth.unlinkWallet;
    try {
        const response = await axios.post(url, id);
        return response;
    } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return null;
    }
}


// gen sign metamask wallet
export async function genSignWalletLink(data) {
    const url = endpoints.auth.genSign;
    try {
        const response = await axios.post(url, data);
        return response;
    } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return null;
    }
}

// gen sign metamask wallet
export async function handleAuthWallet(data) {
    const url = endpoints.auth.authPublic;
    try {
        const response = await axios.post(url, data);
        return response;
    } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return null;
    }
}
