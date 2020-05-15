import React from 'react'
import { RouterReactContext } from './ContextUtils'

export default function useRouter() {
  return React.useContext(RouterReactContext).router
}
