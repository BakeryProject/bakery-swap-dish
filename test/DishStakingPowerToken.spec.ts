import { expect } from 'chai'

const { ethers } = require('@nomiclabs/buidler')

describe('DishStakingPowerToken', function() {
  it('decimals', async function() {
    const DishStakingPowerToken = await ethers.getContractFactory('DishStakingPowerToken')
    const dishStakingPowerToken = await DishStakingPowerToken.deploy()
    await dishStakingPowerToken.deployed()
    expect(await dishStakingPowerToken.decimals()).to.equal(18)
  })
})
