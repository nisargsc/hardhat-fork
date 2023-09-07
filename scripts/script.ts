import { ethers } from "hardhat";
import * as netHelper from "@nomicfoundation/hardhat-toolbox/network-helpers";

async function main() {
  const signerAddress1 = "0xf8A03c70E20F239796280D00839dA59F1921278d";
  const signerAddress2 = "0x428ff5B0A9B91f4066a7073a1988a5EC4F69FDc8";

  // One way to impersonate the account is by using this hardhat-ethers function
  const impersonatedSigner1 = await ethers.getImpersonatedSigner(
    signerAddress1
  );

  /* 
  Other way to impersonate the account is by using the netHelper
  This is simmilar to the vm.Prank() in foundry
  This in backend calls the RPC method `hardhat_impersonateAccount`
  It is equivalant to doing:
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [signerAddress],
    }); 
  */
  await netHelper.impersonateAccount(signerAddress2);
  const impersonatedSigner2 = await ethers.getSigner(signerAddress2);

  let currentBlock = await ethers.provider.getBlock("latest");
  let blockNumber = currentBlock?.number;
  console.log(`Current blockNumber: ${blockNumber}`);

  console.log(
    `Impersonated Signer1 Balance: ${await ethers.provider.getBalance(
      signerAddress1
    )}`
  );
  console.log(
    `Impersonated Signer2 Balance: ${await ethers.provider.getBalance(
      signerAddress2
    )}`
  );

  console.log("Transfering 0.001 eth from account1 to account2");
  await impersonatedSigner1.sendTransaction({
    to: signerAddress2,
    value: ethers.parseEther("0.001"),
    data: "0x",
  });

  console.log(
    `Impersonated Signer1 Balance: ${await ethers.provider.getBalance(
      signerAddress1
    )}`
  );
  console.log(
    `Impersonated Signer2 Balance: ${await ethers.provider.getBalance(
      signerAddress2
    )}`
  );

  console.log("Transfering 0.001 eth back to account1 from account2");
  await impersonatedSigner2.sendTransaction({
    to: signerAddress1,
    value: ethers.parseEther("0.001"),
    data: "0x",
  });
  // This helper can be used to stop Impersonating the Account
  await netHelper.stopImpersonatingAccount(signerAddress2);

  console.log(
    `Impersonated Signer1 Balance: ${await ethers.provider.getBalance(
      signerAddress1
    )}`
  );
  console.log(
    `Impersonated Signer2 Balance: ${await ethers.provider.getBalance(
      signerAddress2
    )}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
