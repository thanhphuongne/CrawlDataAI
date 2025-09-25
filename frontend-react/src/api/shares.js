import axios, { endpoints } from 'src/utils/axios';

import { setSession } from 'src/auth/context/jwt/utils';

// ----------------------------------------------------------------------



export async function getShareById(id) {
    const url = endpoints.campaign.shares + '/' + id;
    try {
        const response = await axios.get(url);
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export async function loginByGoogle(info) {
    const url = endpoints.auth.loginGoogle;
    try {
        const response = await axios.post(url, info);
        if (response.data) {
            window.localStorage.setItem("user", JSON.stringify(response.data.data));
            setSession(response.data.token);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error fetching data:', error);
        return false;
    }
}

// Hàm đếm khi truy cập vào campaign
export async function countVisitCampaigns(user, ref_id, link, campaign_id) {
    const url = endpoints.campaign.traffics;
    try {
        const response = await axios.post(url, {user_id: ref_id, url: link, name: campaign_id}, { });
        return response;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


