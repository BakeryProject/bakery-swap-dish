import { expect } from 'chai'

const { ethers } = require('@nomiclabs/buidler')

const exchangeNftAddress = '0x6ebF7b9F11a81101d4a929e19FCefba72e8AE5cc'
const dishNFTAddress = '0xC3a7736b284cE163c45D92b75da4d4A34847be63'

import { ExchangeNft } from '../typechain/ExchangeNft'
import { ExchangeNftFactory } from '../typechain/ExchangeNftFactory'
import { Erc721 } from '../typechain/Erc721'
import { Erc721Factory } from '../typechain/Erc721Factory'

let exchangeNft: ExchangeNft
let dishNFT: Erc721

describe('ExchangeNft', function() {
  beforeEach(async () => {
    const exchangeNftFactory: ExchangeNftFactory = await ethers.getContractFactory('ExchangeNFT')
    exchangeNft = exchangeNftFactory.attach(exchangeNftAddress)
    const erc721Factory: Erc721Factory = await ethers.getContractFactory('Erc721')
    dishNFT = erc721Factory.attach(dishNFTAddress)
  })

  it('maxTokenId', async function() {
    const maxTokenId = await exchangeNft.MAX_TRADABLE_TOKEN_ID()
    console.log(`${maxTokenId}`)
  })

  it('readyToSellToken', async function() {
    const approveTx = await dishNFT.approve(exchangeNftAddress, 33)
    console.log(`approve ${approveTx.hash}`)
    await approveTx.wait()
    const readyToSellTokenTx = await exchangeNft.readyToSellToken(33, '12360000000000000000000')
    console.log(`readyToSellToken ${readyToSellTokenTx.hash}`)
  })

  it('cancelSellToken', async function() {
    const needCancelTokens = [4, 6, 46, 3, 33]
    for (const tokenId of needCancelTokens) {
      const cancelSellTokenTx = await exchangeNft.cancelSellToken(tokenId)
      console.log(`cancelSellToken ${tokenId} ${cancelSellTokenTx.hash}`)
    }
  })

  it('getAsksByPage', async function() {
    const page = await exchangeNft.getAsksByPage(0, 10)
    console.log(`exchangeNft ${page}`)
  })

  it('getAsksByPageDesc', async function() {
    const page = await exchangeNft.getAsksByPageDesc(1, 9)
    console.log(`exchangeNft ${page}`)
  })

  it('getAsks', async function() {
    const asks = await exchangeNft.getAsks()
    console.log(`exchangeNft ${asks}`)
  })

  it('getAskLength', async function() {
    const asks = await exchangeNft.getAskLength()
    console.log(`exchangeNft ${asks}`)
  })

  it('getAsksDesc', async function() {
    const asks = await exchangeNft.getAsksDesc()
    console.log(`exchangeNft ${asks}`)
  })

  it('getAsksByUser', async function() {
    const asks = await exchangeNft.getAsksByUser('0x65b1d445aC80614A0a2BfECC492f458F88657264')
    console.log(`exchangeNft ${asks}`)
  })

  it('getAsksByUserDesc', async function() {
    const asks = await exchangeNft.getAsksByUserDesc('0x337E3Cee9c3e892F84c76B0Ec2C06fd4Ab06A734')
    console.log(`exchangeNft ${asks}`)
  })
})
