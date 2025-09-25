import { ethers, Contract } from "ethers";

import { LOCK_TOKEN } from "src/constants/abis/lock-token";
import { REWARD_POOL } from "src/constants/abis/reward-pool";
import { TOKEN_ERC_20 } from "src/constants/abis/token-erc20";
import { CAMPAIGN_POOL } from "src/constants/abis/campaign-pool";

export const provider = () => {
    try {
        return new ethers.providers.Web3Provider(window.ethereum)
    } catch (error) {
        alert('please connect wallet')
    }
};
export const signer = () => {
    try {
        return provider().getSigner();
    } catch (error) {
        alert('please connect wallet')
    }
};
export const MaxAmount = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
export const Network = {
    id: 80002,
    name: 'Polygon Amoy',
    campaignFactory: '0x25e3f78D8f7478834c4776200c090bB00F05B4c3',
    lockToken: '0x995B8F7D092484FDf2e1B7b636e23A483F5B085e',
    tokenXoffer: '0x072DF4734BBF4ea9497305eDA7a32F46E2C6B843',
    etherscanUrl: 'https://www.oklink.com/amoy',
    imgCreateFactory: 'assets/images/logoPolygon.png',
    faucetConstract: '0x695bdE7F02224742B47F54A8d2b6Ed242fB9184c',
    tokenFaucess: '0x072DF4734BBF4ea9497305eDA7a32F46E2C6B843'
}
export const getContract = (address, abi) => new Contract(address, abi, signer())

// get balance referral
export const getInfoRewardReferral = async (contractAddress) => {
    try {
        const contract = getContract(contractAddress, CAMPAIGN_POOL);
        const account = await signer().getAddress();
        const infoReward = await contract.kolInfor(account);
        return { balance: infoReward };
    } catch (error) {
        if (error.code === "ACTION_REJECTED") {
            return { status: false, message: error.reason };
        } else {
            return { status: false, message: error.reason };
        }
    }
}

// get balance lam nhiem vu
export const getInfoRewardQuest = async (contractAddress) => {
    try {
        const contract = getContract(contractAddress, REWARD_POOL);
        const account = await signer().getAddress();
        const infoReward = await contract.userRewards(account);
        return { balance: infoReward };
    } catch (error) {
        if (error.code === "ACTION_REJECTED") {
            return { status: false, message: error.reason };
        } else {
            return { status: false, message: error.reason };
        }
    }
}

// rut tien referral cua campaign
export const claimRewardReferral = async (contractAddress) => {
    try {
        const tokenContract = getContract(contractAddress, CAMPAIGN_POOL);
        const transaction = await tokenContract.kolWidthDraw({ value: 0 });

        // Wait for the transaction to be mined
        await transaction.wait()
        // Access specific information from the event
        return {
            status: true, message: ''
        }
    } catch (error) {
        if (error.code === "ACTION_REJECTED") {
            return { status: false, message: error.reason };
        } else {
            return { status: false, message: error.reason };
        }
    }
}

// rut tien lam nhiem vu cua campaign
export const claimAllRewardQuest = async (contractAddress) => {
    try {
        const tokenContract = getContract(contractAddress, REWARD_POOL);
        const transaction = await tokenContract.claim();

        // Wait for the transaction to be mined
        await transaction.wait()
        // You can access more information in the receipt, such as events emitted
        return {
            status: true, message: ''
        }
    } catch (error) {
        if (error.code === "ACTION_REJECTED") {
            return { status: false, message: error.reason };
        } else {
            return { status: false, message: error.reason };
        }
    }
}

// unlock package
export const unlockTokenPackage = async () => {
    try {
        const tokenContract = getContract(Network.lockToken, LOCK_TOKEN);
        const transaction = await tokenContract.UnlockToken([]);

        // Wait for the transaction to be mined
        const receipt = await transaction.wait()
        const unlockTokenEvent = receipt.events.find((event) => event.event === 'UnlockTokenEvent');

        // Access specific information from the event
        const sender = unlockTokenEvent.args[0];
        const type = unlockTokenEvent.args[1];
        const lockAmount = unlockTokenEvent.args[2];
        const transaction_hash = transaction.hash;
        // You can access more information in the receipt, such as events emitted
        return {
            status: true, sender, type, lockAmount, transaction_hash
        }
    } catch (error) {
        if (error.code === "ACTION_REJECTED") {
            return { status: false, message: error.reason };
        } else {
            return { status: false, message: error.reason };
        }
    }
}

// update package 
export const updaeTokenPackage = async (_type) => {
    try {
        const tokenContract = getContract(Network.lockToken, LOCK_TOKEN);
        const functionArguments = [
            _type
        ];
        const transaction = await tokenContract.LockToken(...functionArguments);
        // Wait for the transaction to be mined
        const receipt = await transaction.wait()
        const lockTokenEvent = receipt.events.find((event) => event.event === 'LockTokenEvent');

        // Access specific information from the event
        const sender = lockTokenEvent.args[0];
        const type = lockTokenEvent.args[1];
        const lockAmount = lockTokenEvent.args[2];
        const transaction_hash = transaction.hash;
        // You can access more information in the receipt, such as events emitted
        return {
            status: true, sender, type, lockAmount, transaction_hash
        }
    } catch (error) {
        if (error.code === "ACTION_REJECTED") {
            return { status: false, message: error.reason };
        } else {
            return { status: false, message: error.reason };
        }
    }
}

export const checkAllowance = async () => {
    try {
        const tokenContractAddress = Network.tokenXoffer;
        const spenderAddress = Network.lockToken
        const tokenContract = getContract(tokenContractAddress, TOKEN_ERC_20); // Replace TOKEN_ABI with your ERC-20 ABI
        const account = await signer().getAddress();
        const allowance = await tokenContract.allowance(account, spenderAddress);
        return Number(allowance.toString());
    } catch (error) {
        console.error('Error checking allowance:', error);
        throw error;
    }
}

export const approveToken = async () => {
    try {
        const tokenContractAddress = Network.tokenXoffer;
        const spenderAddress = Network.lockToken
        const tokenContract = getContract(tokenContractAddress, TOKEN_ERC_20);
        const transaction = await tokenContract.approve(spenderAddress, MaxAmount);
        const receipt = await transaction.wait();
        return { status: true, data: receipt };
    } catch (error) {
        if (error.code === "ACTION_REJECTED") {
            return { status: false, message: error.reason };
        } else {
            return { status: false, message: error.data.message };
        }
    }
}
