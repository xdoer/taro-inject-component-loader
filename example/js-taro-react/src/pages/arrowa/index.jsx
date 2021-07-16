import React, { Component } from 'react'
import { View } from '@styli/taro'

class CustomComponent3 extends Component {
  render() {
    return <View>Component C</View>
  }
}

const CustomComponent2 = () => <View>Component B</View>

const CustomComponent = () => {
  return (
    <View>
      export default arrow function Component A
      <CustomComponent2 />
      <CustomComponent3 />
    </View>
  )
}

export default CustomComponent
