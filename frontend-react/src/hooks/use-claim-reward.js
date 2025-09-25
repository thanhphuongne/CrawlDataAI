// import { claimRewardUser, getBalanceReward } from "./ton/ton-service";
import { ethers } from "ethers";

import { claimRewardUser } from "./ton/ton-service";
import { approveToken, checkAllowance, updaeTokenPackage, unlockTokenPackage, claimAllRewardQuest, claimRewardReferral } from "./metamask/metamask-service";


// nhan thuong lam referral cua campaign
export async function useClaimAllRewardQuest(chain, addressAirDrop, account, tonConnectUI, setStatusCLaim, campaign_id) {
    if (chain === 'ton') {
        await claimRewardUser('airdrop', addressAirDrop, account, tonConnectUI, setStatusCLaim, campaign_id);
        return { status: true };
    } else {
        const data = await claimAllRewardQuest(addressAirDrop);
        return data;
    }
}

// nhan thuong lam referral cua campaign
export async function useClaimRewardReferral(chain, addressAff, account, tonConnectUI, setStatusCLaim, campaign_id) {
    if (chain === 'ton') {
        await claimRewardUser('referral', addressAff, account, tonConnectUI, setStatusCLaim, campaign_id);
        return { status: true };
    } else {
        const data = await claimRewardReferral(addressAff);
        return data;
    }
}

// unlockToken 
export async function useUnlockPackage() {
    const data = await unlockTokenPackage()
    if (data.status) {
        const data_input = {
            "public_address": data.sender,
            "transaction_hash": data.transaction_hash,
            "status": true
        }
        return data_input;
    }
    return { status: false }
}
// update package 
export async function useUpdatePackage(id) {
    const data = await updaeTokenPackage(id)
    if (data.status) {
        const balanceInEth = ethers.utils.formatEther(data.lockAmount);
        const data_input = {
            "amount": balanceInEth,
            "package_id": Number(data.type.toString()),
            "public_address": data.sender,
            "transaction_hash": data.transaction_hash,
            "unit": "XO",
            "status": true
        }
        return data_input;
    }
    return { status: false }
}

// check approve token 
export async function checkStatusApproveToken() {
    const data = await checkAllowance();
    return Boolean(data);
}
//  approve token 
export async function approveTokenLock() {
    const data = await approveToken();
    return data;
}
