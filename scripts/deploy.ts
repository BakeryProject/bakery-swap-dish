const { ethers } = require('@nomiclabs/buidler')


const bakeryToken = '0xe02df9e3e622debdd69fb838bb799e3f168902c5'
const bakeryMaster = '0x20eC291bB8459b6145317E7126532CE7EcE5056f'
const feeAddr = '0x0986c92C58eD9d8a1b79744A9ec088748da5E8d0'

const dishStakingPowerToken = '0x54F135A5fB523E467bcD6aA934939E1F25382275'
const dishNFT = '0xa7463C3163962b12AEB623147c2043Bb54834962' // bsc
// const dishNFT = '0xC3a7736b284cE163c45D92b75da4d4A34847be63' // bsct
const dishMaster = '0x7145319189629AFcF31754D8AC459265FCa4cF91' // bsc
// const dishMaster = '0x22CbdB1Da36B35725d1D75A7784271EE3f869b30' // bsct
// const exchangeNFT = '0x6ebF7b9F11a81101d4a929e19FCefba72e8AE5cc' // bsct
const exchangeNFT = '0x05D189D22D9916837A82438D74F3837Ac70b2831' // bsc

async function deployContract(name: string, args: string[] = []) {
    console.log(`start deployContract ${name}, ${args}`)
    // @ts-ignores
    const factory = await ethers.getContractFactory(name)

    // If we had constructor arguments, they would be passed into deploy()
    const contract = await factory.deploy(...args)

    // The address the Contract WILL have once mined
    console.log(`contract ${name} address ${contract.address}`)

    // The transaction that was sent to the network to deploy the Contract
    console.log(`contract ${name} deploy transaction hash ${contract.deployTransaction.hash}`)

    // The contract is NOT deployed yet; we must wait until it is mined
    await contract.deployed()
    console.log(`finish deployContract ${name}`)
}

async function transferDishStakingPowerTokenOwnershipToDishMaster() {
    const DishStakingPowerToken = await ethers.getContractFactory('DishStakingPowerToken')
    const tx = await DishStakingPowerToken.attach(dishStakingPowerToken).transferOwnership(dishMaster);
    console.log(`transferDishStakingPowerTokenOwnershipToDishMaster ${tx.hash}`)
    await tx.wait()
}

async function transferDishNFTOwnershipToDishMaster() {
    const DishNFT = await ethers.getContractFactory('DishNFT')
    const tx = await DishNFT.attach(dishNFT).transferOwnership(dishMaster);
    console.log(`transferDishNFTOwnershipToDishMaster ${tx.hash}`)
    await tx.wait()
}

async function approveBakeryMasterForSpendStakingPowerToken() {
    const DishMaster = await ethers.getContractFactory('DishMaster')
    const tx = await DishMaster.attach(dishMaster).approveBakeryMasterForSpendStakingPowerToken();
    console.log(`approveBakeryMasterForSpendStakingPowerToken ${tx.hash}`)
    await tx.wait()
}

async function updateDishMasterFee(fee: number) {
    const DishMaster = await ethers.getContractFactory('DishMaster')
    const tx = await DishMaster.attach(dishMaster).updateFee(fee);
    console.log(`updateDishMasterFee ${tx.hash}`)
    await tx.wait()
}

async function updateMaxTradableTokenId(tokenId: number) {
    const ExchangeNFT = await ethers.getContractFactory('ExchangeNFT')
    const exchangeNFTContract = ExchangeNFT.attach(exchangeNFT);
    const oldMaxTokenId = await exchangeNFTContract.MAX_TRADABLE_TOKEN_ID();
    console.log(`old token id ${oldMaxTokenId}`)
    const tx = await exchangeNFTContract.updateMaxTradableTokenId(tokenId);
    console.log(`updateMaxTradableTokenId ${tx.hash}`)
    await tx.wait()
}

async function main() {
    // await deployContract('DishStakingPowerToken')
    // await deployContract('DishNFT')

    /**
     start deployContract DishStakingPowerToken,
     contract DishStakingPowerToken address 0x54F135A5fB523E467bcD6aA934939E1F25382275
     contract DishStakingPowerToken deploy transaction hash 0x654c3e0fa609b3caf82e0dc2f7707a12519c818c45523a4f24411502a66a7ca2
     finish deployContract DishStakingPowerToken
     start deployContract DishNFT,
     contract DishNFT address 0xa7463C3163962b12AEB623147c2043Bb54834962
     contract DishNFT deploy transaction hash 0xe7f15c7c5f20bf7b64915e67420644fd7513dacceaa738547101aa4e87ddc631
     finish deployContract DishNFT
     */
    // await deployContract('DishMaster', [dishStakingPowerToken, bakeryToken, dishNFT, bakeryMaster, feeAddr]);
    /**
     start deployContract DishMaster, 0x54F135A5fB523E467bcD6aA934939E1F25382275,0xe02df9e3e622debdd69fb838bb799e3f168902c5,0xa7463C3163962b12AEB623147c2043Bb54834962,0x20eC291bB8459b6145317E7126532CE7EcE5056f,0x0986c92C58eD9d8a1b79744A9ec088748da5E8d0
     contract DishMaster address 0x7145319189629AFcF31754D8AC459265FCa4cF91
     contract DishMaster deploy transaction hash 0x96fc2ebb3cf0cf5481f85bd7043115e9d25682859d0892b6d77e1b36eb53361f
     finish deployContract DishMaster
     */

    // await transferDishStakingPowerTokenOwnershipToDishMaster();
    // await transferDishNFTOwnershipToDishMaster();
    // await approveBakeryMasterForSpendStakingPowerToken();
    /**
     transferDishStakingPowerTokenOwnershipToDishMaster 0x2dd118e935184589a90c91770320b6bd6151b4c886c632e7fa1d81f72ab80108
     transferDishNFTOwnershipToDishMaster 0xaaa678fb78b421c5b3c6fd763c5ee74739d82ec3878f84eedf9fb2933a72daa8
     approveBakeryMasterForSpendStakingPowerToken 0x6c07e9468312dec93ab28c0883aabf47fdcff10a657f5f64f2cd946b333752c1
     */
    // await deployContract('ExchangeNFT', [ dishNFT, bakeryToken]);
    /**
     start deployContract ExchangeNFT, 0xa7463C3163962b12AEB623147c2043Bb54834962,0xe02df9e3e622debdd69fb838bb799e3f168902c5
     contract ExchangeNFT address 0x05D189D22D9916837A82438D74F3837Ac70b2831
     contract ExchangeNFT deploy transaction hash 0x7a7226b9eb250a6fba2e65321d0894f68589bb5cf30c4e357eed03ab63d24b7b
     finish deployContract ExchangeNFT
     */
    // await updateMaxTradableTokenId(859);
    /**
     updateMaxTradableTokenId 0x536b7fb2880ea3b486a8f6674379800f3be9424b45d70911ef2f5760a845c500
     */
    /**
     updateMaxTradableTokenId 0xc471af8d5394d4de267c2257837d609f1f9b71f46bd37e95983c1175c498a0c7
     */
    // await updateDishMasterFee(100);
    /**
     updateDishMasterFee 0x8fbc8a2706d6896c577757a7c5df4cde6aa111cb3e78334537db295bebb00672
     */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error)
      process.exit(1)
  })
