import { enqueueSnackbar } from 'notistack';

import axios, { endpoints } from 'src/utils/axios';

import { setSession } from 'src/auth/context/jwt/utils';

// ----------------------------------------------------------------------

export async function loginByTon(info) {
    const url = endpoints.auth.loginTon;
    try {
        const response = await axios.post(url, info);
        if (response.data) {
            window.localStorage.setItem("user", JSON.stringify(response.data.data));
            return response;
        }
        return false;
    } catch (error) {
        enqueueSnackbar(error.msg, { variant: 'error' });
        return false;
    }
}

export async function loginUserPass(info) {
    const url = endpoints.auth.login;
    try {
        const response = await axios.post(url, info);
        if (response.data) {
            window.localStorage.setItem("user", JSON.stringify(response.data.data));
            setSession(response.data.token);
            return true;
        }
        return false;
    } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return false;
    }
}

export async function loginByGoogle(info) {
    const url = endpoints.auth.loginGoogle;
    try {
        const response = await axios.post(url, info);
        // console.log("response.data==",response.data)
        if (response.data) {
            window.localStorage.setItem("user", JSON.stringify(response.data.data));
            setSession(response.data.token);
            return response.data;
        }
        return false;
    } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return false;
    }
}

export async function loginByMetaMask(info) {
    const url = endpoints.auth.loginMetaMask;
    try {
        const response = await axios.post(url, info);
        if (response.data) {
            window.localStorage.setItem("user", JSON.stringify(response.data.data));
            setSession(response.data.token);
            return true;
        }
        return false;
    } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
        return false;
    }
}
