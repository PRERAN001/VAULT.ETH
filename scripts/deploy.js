const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying with:", deployer.address);

    const balance = await deployer.getBalance();

    console.log(
        "Balance:",
        ethers.utils.formatEther(balance),
        "ETH"
    );

    const Upload = await ethers.getContractFactory("Upload");

    const upload = await Upload.deploy();

    await upload.deployed();

    console.log("Contract deployed to:", upload.address);
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });