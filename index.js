const enrollABI = require("./enrollABI.json")
const newABI = require("./newContractABI.json")
const ethers = require("ethers");
const Bottleneck = require("bottleneck");


const enrollContractAddress = "0xBc4f739F6310BdE8f5c48134Ca221Bb5349ccd74";
const newEnrollContract = "0xc15a65D129D2a3D4C4Ea10270755F15E6FcF5b42";

// const providerFantom = new ethers.JsonRpcProvider("https://rpc.ankr.com/fantom_testnet/935e9c3d97d9f4e1eb8ee73a13ae476a5abb9d1c87fc3164315958c3adc4faf6");
// const enrollContract = new ethers.Contract(enrollContractAddress, enrollABI, providerFantom)

const providerMumbai = new ethers.JsonRpcProvider("https://cosmopolitan-dimensional-layer.matic-testnet.discover.quiknode.pro/183cf778fe4c2260b3b7dbc9bb264848f4f3b0ee/")
const signerWallet = new ethers.Wallet("----private_key---", providerMumbai)
const oldContract = new ethers.Contract(enrollContractAddress, enrollABI, signerWallet)
const newContract = new ethers.Contract(newEnrollContract, newABI, signerWallet)

//rate limiter 
const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 300,
});


const initiateMigrationOfMembers = async () => {
    const members = await oldContract.getAllMembers();
    for (let i = 0; i < members.length; i++) {
        const element = members[i];
        const index = parseInt(element[0])
        try {
            await limiter.schedule(async () => {
                const migrateMember = await newContract.migrationMethod(
                    index,
                    parseInt(element[1]),
                    element[2],
                    element[3],
                    element[4],
                    element[5],
                    element[6],
                    element[7]
                );
                console.log("TX HASH - ", migrateMember.hash);
                await migrateMember.wait();
                console.log(
                    `Migrated ${element[2]}, ${element[3]} from ${enrollContractAddress} to ${newEnrollContract}`
                );
            });
        } catch (error) {
            console.log(
                `An error occurred while migrating member - ${element[2]} - `,
                error
            );
        }
    }
};

initiateMigrationOfMembers();
