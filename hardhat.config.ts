import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();
const rpcUrl = process.env.RPC_URL as string;

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  defaultNetwork: "buildbear",
  networks: {
    buildbear: {
      url: rpcUrl,
    },
  },
};

export default config;
