import invariant from 'invariant'
import React from 'react'
import createReactClass from 'create-react-class'
import hoistStatics from 'hoist-non-react-statics'
import { RouterReactContext } from './ContextUtils'
import { routerShape } from './PropTypes'

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export default function withRouter(WrappedComponent, options) {
  const withRef = options && options.withRef

  const WithRouter = createReactClass({
    displayName: 'WithRouter',

    propTypes: { router: routerShape },

    getWrappedInstance() {
      invariant(
        withRef,
        'To access the wrapped instance, you need to specify ' +
        '`{ withRef: true }` as the second argument of the withRouter() call.'
      )

      return this.wrappedInstance
    },

    render() {
      const router = this.props.router || this.context
      if (!router) {
        return <WrappedComponent {...this.props} />
      }

      const { params, location, routes } = router
      const props = { ...this.props, router, params, location, routes }

      if (withRef) {
        props.ref = (c) => { this.wrappedInstance = c }
      }

      return <WrappedComponent {...props} />
    }
  })

  WithRouter.contextType = RouterReactContext
  WithRouter.displayName = `withRouter(${getDisplayName(WrappedComponent)})`
  WithRouter.WrappedComponent = WrappedComponent

  return hoistStatics(WithRouter, WrappedComponent)
}
