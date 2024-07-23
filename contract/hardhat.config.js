require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [""],

    },
  },
  etherscan: {
    apiKey:
      'CZ1G6HTXGMYAXMS531F3SXQ85FJA5UBEAE'
  }
};
