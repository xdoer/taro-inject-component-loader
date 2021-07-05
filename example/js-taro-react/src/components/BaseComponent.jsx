import { View } from '@styli/taro'
import React, { FC, memo } from 'react'

export default memo(({}) => {
  console.log(1111)
  return (
    <View center column>
      <View red40 f-40>
        BaseComponent
      </View>
      <View gray30 f-24>
        webpack inject
      </View>
    </View>
  )
})
