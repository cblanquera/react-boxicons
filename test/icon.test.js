const { expect } = require('chai')
const { vm } = require('../dist')
const babel = require('@babel/core')
describe('Icon Tests', () => {
  it('Should be able to render cog', () => {
    vm.addRule(/\.(js)$/, (file, code) => {
      return babel.transform(code, {
        presets: [
          '@babel/preset-env',
          '@babel/preset-react'
        ]
      }).code
    })
    const IconCog = require('react-boxicons/regular/Cog')
  })
})