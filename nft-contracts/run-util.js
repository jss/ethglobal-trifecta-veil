import hre from "hardhat";

export async function verifyContract(contractAddress, brandName) {
  console.log("Verifying contract...");
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [brandName],
      contract: "contracts/VeilBrand.sol:VeilBrand"
    });
    console.log("Contract successfully verified.");
  } catch (error) {
    console.error("Error verifying contract:", error.message);
    console.log("You can try manual verification with:");
    console.log(`npx hardhat verify --network baseSepolia ${contractAddress} "${brandName}"`);
  }
}

export async function deployTokenContract(brandName) {
  console.log(`Deploying ${brandName} contract to Base Sepolia...`);
  const VeilBrand = await hre.ethers.getContractFactory("VeilBrand");
  const brandContract = await VeilBrand.deploy(brandName);
  await brandContract.waitForDeployment();
  const contractAddress = await brandContract.getAddress();
  console.log(`${brandName} Contract deployed to: ${contractAddress}`);
  const deploymentTime = new Date();
  const [signer] = await hre.ethers.getSigners();
  const deploymentInfo = {
    brandName: brandName,
    signer: await signer.getAddress(),
    deployedAt: deploymentTime.toISOString(),
    address: contractAddress,
    network: hre.network.name,
    basescanUrl: `https://sepolia.basescan.com/address/${contractAddress}`,
  };
  console.log(`Waiting 30s before verification...`);
  await new Promise(resolve => setTimeout(resolve, 30000));
  verifyContract(contractAddress, brandName);
  return deploymentInfo;
}

export async function generateDataURI(name, description, imageUri, brand, type) {
  console.log(`Generating on-chain metadata for ${name}...`);
  const metadata = {
    name: name,
    description: description,
    image: imageUri,
    properties: {
      brand: brand,
      type: type,
    }
  };
  const jsonString = JSON.stringify(metadata);
  const base64EncodedJson = Buffer.from(jsonString).toString('base64');
  const dataUri = `data:application/json;base64,${base64EncodedJson}`;
  console.log(`Generated on-chain metadata successfully for ${name}`);
  return dataUri;
}

export async function createToken(
  brandContract,
  id,
  tokenName,
  supplyLimit,
  metadataUri
) {
  console.log(`Creating token type "${tokenName}" with ID ${id}...`);
  const tx = await brandContract.createToken(id, tokenName, supplyLimit, metadataUri);
  await tx.wait();
  console.log(`Successfully created token type: ${tokenName} (ID: ${id})`);
  return id;
}

export async function mintToken(
  brandContract,
  to,
  id,
  amount,
  data = "0x"
) {
  console.log(`Minting ${amount} of token ID ${id}...`);
  const tx = await brandContract.mint(to, id, amount, data);
  await tx.wait();
  console.log(`Successfully minted ${amount} of token ID ${id} to ${to}`);
}
