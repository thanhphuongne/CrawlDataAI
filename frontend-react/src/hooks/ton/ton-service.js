import { beginCell } from "@ton/core";
import { enqueueSnackbar } from "notistack";
import { toUserFriendlyAddress } from "@tonconnect/ui-react";

import { ConfigTon } from "src/constants/config-ton";
import { updateClaimQuest, updateClaimReferral } from "src/api/campaign";


const hashStringToInt = (str) => {
    let hash = 5381;
    for (let i = 0; i < str.length; i += 1) {
        hash = (hash * 33) ^ str.charCodeAt(i); // Using addition and multiplication
    }
    return hash >>> 0; // Ensure the hash is a positive integer
}

// claim reward airdrop campaign
export const claimRewardUser = async (type, airAddress, account, tonConnectUI, setStatusCLaim, campaign_id) => {
    const yourAccount = toUserFriendlyAddress(account, ConfigTon.chain === 'testnet');
    const hashInt = hashStringToInt(yourAccount);
    const queryId = Date.now();
    const body = beginCell()
        .storeUint(0x855511cc, 32)
        .storeUint(queryId, 64)
        .storeUint(BigInt(hashInt), 256)
        .endCell();
    tonConnectUI.sendTransaction({
        validUntil: Date.now() + 5 * 60 * 1000,
        messages: [
            {
                address: airAddress,
                amount: '50000000',
                payload: body.toBoc().toString("base64"),
            }
        ],
    }).then((resopnse) => {
        setTimeout(() => {
            if (type === 'airdrop') {
                updateClaimQuest({ campaign_id: campaign_id });
            } else {
                const bodyData = {
                    "aff_id": '',
                    "wallet_address": account,
                    "model_id": campaign_id
                  }
                updateClaimReferral(bodyData);
            }
            setStatusCLaim(true);
            enqueueSnackbar('Claim success');
        }, 3000);
    }, (err => {
        enqueueSnackbar(err.message?.replace('[TON_CONNECT_SDK_ERROR]', ''), { variant: 'error' });
    }))
}