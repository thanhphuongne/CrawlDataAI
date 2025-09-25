export const CAMPAIGN_FACTORY = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_admin",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "campaignPool",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "rewardPool",
        "type": "address"
      }
    ],
    "name": "CampaignCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "ADDRESS_ETH_ZERO",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract ERC20",
        "name": "_kolToken",
        "type": "address"
      },
      {
        "internalType": "contract ERC20",
        "name": "_rewardToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_campaignBudget",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_amountReward",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_maximum_user_kol",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_type_campaign",
        "type": "uint256"
      }
    ],
    "name": "createCampaign",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract ERC20",
        "name": "_kolToken",
        "type": "address"
      },
      {
        "internalType": "contract ERC20",
        "name": "_rewardToken",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_campaignPool",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_rewardPool",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_campaignBudget",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_amountReward",
        "type": "uint256"
      }
    ],
    "name": "updateCampaign",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
]