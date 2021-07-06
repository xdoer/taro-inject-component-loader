import React, { Component } from 'react'
import { View } from '@styli/taro'
import { navigateTo } from '@tarojs/taro'
import './index.css'

const data = [
  {
    title: 'Class A',
    path: '/pages/classa/index',
  },
  {
    title: 'Class B',
    path: '/pages/classb/index',
  },
  {
    title: 'Class C',
    path: '/pages/classc/index',
  },
  {
    title: 'Function A',
    path: '/pages/functiona/index',
  },
  {
    title: 'Function B',
    path: '/pages/functionb/index',
  },
  {
    title: 'Function C',
    path: '/pages/functionc/index',
  },
  {
    title: 'Arrow Function A',
    path: '/pages/arrowa/index',
  },
  {
    title: 'Arrow Function b',
    path: '/pages/arrowb/index',
  },
  {
    title: 'connect class',
    path: '/pages/connectclass/index',
  },
  {
    title: 'connect function',
    path: '/pages/connectfunction/index',
  },
  {
    title: 'connect arrow',
    path: '/pages/connectarrow/index',
  },
]

export default class Index extends Component {
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View h-500 center column pt-260>
        {data.map((item, index) => (
          <View
            key={index}
            f-25
            fontBold
            w-200
            h-100
            red70
            bgRed10
            p-10
            rounded-10
            center
            mb-10
            onClick={() => navigateTo({ url: item.path })}
          >
            {item.title}
          </View>
        ))}
      </View>
    )
  }
}
