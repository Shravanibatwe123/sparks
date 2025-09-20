require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
module.exports = {
  solidity: "0.8.19",
  networks: {
    unstablenet: {
      url: process.env.UNSTABLE_RPC || "https://api-unstable.shardeum.org",
      chainId: 8080,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};
