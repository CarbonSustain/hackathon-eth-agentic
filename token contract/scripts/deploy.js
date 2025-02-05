const hre = require("hardhat");
require("dotenv").config();

async function main() {
    // Get contract factory
    const CarbonSustain = await hre.ethers.getContractFactory("CarbonSustain");

    // Deploy contract with constructor arguments
    const contract = await CarbonSustain.deploy(
        process.env.KLIMADAO_TOKEN_ADDRESS,
        process.env.TOUCAN_TOKEN_ADDRESS,
        process.env.PROFIT_WALLET
    );

    // Wait for contract deployment
    await contract.waitForDeployment();

    console.log(`CarbonSustain deployed to: ${await contract.getAddress()}`);
}

// Run the deployment script
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
