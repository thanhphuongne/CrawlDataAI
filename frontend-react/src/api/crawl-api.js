import { enqueueSnackbar } from 'notistack';

import axios, { endpoints } from 'src/utils/axios';

import { setSession } from 'src/auth/context/jwt/utils';

// ----------------------------------------------------------------------

export async function registerCrawl(data) {
  const url = endpoints.crawl.register;
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    enqueueSnackbar(error.message || 'Registration failed', { variant: 'error' });
    throw error;
  }
}

export async function loginCrawl(data) {
  const url = endpoints.crawl.login;
  try {
    const response = await axios.post(url, data);
    if (response.data && response.data.token) {
      setSession(response.data.token);
      window.localStorage.setItem("user", JSON.stringify(response.data.data || response.data));
    }
    return response.data;
  } catch (error) {
    enqueueSnackbar(error.message || 'Login failed', { variant: 'error' });
    throw error;
  }
}

export async function createCrawlRequest(data) {
  const url = endpoints.crawl.createRequest;
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    enqueueSnackbar(error.message || 'Failed to create request', { variant: 'error' });
    throw error;
  }
}

export async function getCrawlRequestById(id) {
  const url = endpoints.crawl.getRequestById(id);
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    enqueueSnackbar(error.message || 'Failed to get request', { variant: 'error' });
    throw error;
  }
}

export async function getAllCrawlRequests(params = {}) {
  const url = endpoints.crawl.getAllRequests;
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    enqueueSnackbar(error.message || 'Failed to get requests', { variant: 'error' });
    throw error;
  }
}

export async function sendCrawlDialog(data) {
  const url = endpoints.crawl.sendDialog;
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    enqueueSnackbar(error.message || 'Failed to send dialog', { variant: 'error' });
    throw error;
  }
}

export async function getCrawlDialogsByUser(userId, params = {}) {
  const url = endpoints.crawl.getDialogsByUser(userId);
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    enqueueSnackbar(error.message || 'Failed to get dialogs', { variant: 'error' });
    throw error;
  }
}

export async function getCrawlDataByRequest(requestId) {
  const url = endpoints.crawl.getDataByRequest(requestId);
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    enqueueSnackbar(error.message || 'Failed to get data', { variant: 'error' });
    throw error;
  }
}

export async function downloadCrawlExport(id, format = 'json') {
  const url = endpoints.crawl.downloadExport(id, format);
  try {
    const response = await axios.get(url, { responseType: 'blob' });
    return response.data;
  } catch (error) {
    enqueueSnackbar(error.message || 'Failed to download export', { variant: 'error' });
    throw error;
  }
}

export async function deleteCrawlRequest(id) {
  const url = endpoints.crawl.deleteRequest(id);
  try {
    const response = await axios.delete(url);
    return response.data;
  } catch (error) {
    enqueueSnackbar(error.message || 'Failed to delete request', { variant: 'error' });
    throw error;
  }
}

export async function updateCrawlUser(id, data) {
  const url = endpoints.crawl.updateUser(id);
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    enqueueSnackbar(error.message || 'Failed to update user', { variant: 'error' });
    throw error;
  }
}