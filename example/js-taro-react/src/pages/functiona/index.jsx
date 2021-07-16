import React, { Component } from 'react'
import { View } from '@styli/taro'

function CustomComponent() {
  return (
    <View>
      export default function Component A
      <CustomComponent2 />
      <CustomComponent3 />
    </View>
  )
}

const CustomComponent2 = function() {
  return <View>Component B</View>
}

class CustomComponent3 extends Component {
  render() {
    return <View>Component C</View>
  }
}

export default CustomComponent
