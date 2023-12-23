const ethers = require('ethers');


/*
2023.12.22

使用说明：

确保你已经安装了 Node.js。你可以在终端中运行以下命令来检查 Node.js 是否已安装：

node -v
如果 Node.js 尚未安装，你可以从官方网站下载 LTS 版本的 Node.js。

安装 ethers.js 库。在终端中运行以下命令来使用 npm 安装 ethers.js：

npm install ethers@v5


修改私钥 和 投票次数

在当前目录路径下输入命令，开启脚本:
node vote.js

*/



// 私钥一行一个,用英文引号包上，逗号分隔
const privateKeysList = [
    'xxxxxxxx',
]

// 一个地址投票的次数
const voteTimes = 2


const abi =
    [
        {
            "inputs": [],
            "name": "getAllProjects",
            "outputs": [
                {
                    "internalType": "string[]",
                    "name": "",
                    "type": "string[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "projectName",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "votingChoice",
                    "type": "bool"
                }
            ],
            "name": "voteForProject",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
    ]
// 节点
const nodeUrl = "https://rpc.zkfair.io";
const provider = new ethers.providers.JsonRpcProvider(nodeUrl);
// 合约地址
const contractAddress = "0x1D10fdf0432cb6a9a06Bdd1A2F46c94a49bB2afb";




async function main(privateKey) {

    let myWallet = new ethers.Wallet(privateKey, provider);
    let address = myWallet.address

    let contract = new ethers.Contract(contractAddress,
        abi,
        myWallet);

    let res = await contract.getAllProjects()
    let num = parseInt(Math.random() * (res.length))
    let res1 = await contract.voteForProject(res[num], true, { value: ethers.utils.parseEther('0') })
    console.log('${address} VOTE: https://scan.zkfair.io/tx/${res1.hash}')

    // 增加交易时间间隔，例如等待 10 秒
    await sleep(10000);    
}

// 等待函数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function mulVote() {
    for (const privateKey of privateKeysList) {
        for (let i = 0; i < voteTimes; i++) {
            await main(privateKey)
        }
    }
}



