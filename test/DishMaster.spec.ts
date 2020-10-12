import { expect } from 'chai'

const { ethers } = require('@nomiclabs/buidler')

const dishMasterAddress = '0xc3E069A09C8530beb50Bc5b54184B1B23d2C85D4'

import { DishMaster } from '../typechain/DishMaster'
import { DishMasterFactory } from '../typechain/DishMasterFactory'

let dishMaster: DishMaster

describe('DishMaster', function() {
  beforeEach(async () => {
    const dishMasterFactory: DishMasterFactory = await ethers.getContractFactory('DishMaster')
    dishMaster = dishMasterFactory.attach(dishMasterAddress)
  })

  it('approveBakeryMasterForSpendStakingPowerToken', async function() {
    const tx = await dishMaster.approveBakeryMasterForSpendStakingPowerToken()
    console.log(`transferDishNFTOwnershipToDishMaster ${tx.hash}`)
    await tx.wait()
  })

  it('dishInfoMap', async function() {
    const dishInfo = await dishMaster.dishInfoMap(1)
    console.log(`dishInfo ${dishInfo}`)
  })
})
