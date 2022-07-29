require('@nomiclabs/hardhat-waffle')


module.exports={
  solidity:'0.8.9',
  networks:{
    rinkeby:{
      url:'https://eth-rinkeby.alchemyapi.io/v2/6Ar2UKV5bKTiWsB10nWIJfPwz_s6eY77',
      accounts:['2f0d16c874621330bdd73866f52c26539986dac4c7abeaf7abe739ebc67b54ca']
    }
  }
}