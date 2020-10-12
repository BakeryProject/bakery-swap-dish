import { BuidlerConfig, task, usePlugin } from '@nomiclabs/buidler/config'

const { TASK_COMPILE_GET_COMPILER_INPUT } = require('@nomiclabs/buidler/builtin-tasks/task-names')

usePlugin('@nomiclabs/buidler-waffle')
usePlugin('buidler-gas-reporter')
usePlugin('@nomiclabs/buidler-etherscan')
usePlugin('buidler-typechain')
usePlugin('solidity-coverage')

const INFURA_API_KEY = ''
const PRIVATE_KEY: string = process.env.PRIVATE_KEY || ''
const ETHERSCAN_API_KEY = ''

const config: BuidlerConfig = {
  paths: {
    sources: './contracts'
  },
  defaultNetwork: 'buidlerevm',
  solc: {
    version: '0.6.6',
    optimizer: {
      enabled: true,
      runs: 999999
    },
    evmVersion: 'istanbul',
    // @ts-ignore
    outputSelection: {
      '*': {
        '*': [
          'evm.bytecode.object',
          'evm.deployedBytecode.object',
          'abi',
          'evm.bytecode.sourceMap',
          'evm.deployedBytecode.sourceMap',
          'metadata'
        ],
        '': ['ast']
      }
    }
  },
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY]
    },
    bsct: {
      url: 'https://data-seed-prebsc-1-s3.binance.org:8545',
      accounts: [PRIVATE_KEY]
    },
    bsc: {
      url: 'https://bsc-dataseed4.binance.org',
      accounts: [PRIVATE_KEY]
    }
  },
  etherscan: {
    // The url for the Etherscan API you want to use.
    // @ts-ignore
    url: 'https://api-rinkeby.etherscan.io/api',
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v4'
  }
}

task(TASK_COMPILE_GET_COMPILER_INPUT).setAction(async (_, __, runSuper) => {
  const input = await runSuper()
  input.settings.metadata.useLiteralContent = false
  return input
})

export default config
