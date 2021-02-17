import React from 'react'
import { View } from '@styli/taro'

export default function() {
  return (
    <View pt-100>
    </View>
  )
}
o'

export default class Index extends Component {

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <View>
        <View h-300 center>
          <View
            f-25
            fontBold
            w-200
            h-100
            red70
            bgRed10
            rounded-10
            center
            onClick={() => navigateTo({ url: '/package-test/pages/test/index' })}
          >
            点击
          </View>
        </View>
      </View>
    )
  }
}
