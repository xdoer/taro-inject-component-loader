import { View } from '@styli/taro'
import React, { FC, memo } from 'react'

interface BaseComponentProps { }

export const BaseComponent: FC<BaseComponentProps> = memo(({ }) => {
  return (
    <View center column>
      <View red40 f-40>BaseComponent</View>
      <View gray30 f-24>webpack inject</View>
    </View>
  )
})
