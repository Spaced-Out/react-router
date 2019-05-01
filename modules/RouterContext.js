import invariant from 'invariant'
import React from 'react'
import { isValidElementType } from 'react-is'
import { array, func, object } from 'prop-types'

import getRouteParams from './getRouteParams'
import { RouterReactContext } from './ContextUtils'
import { isReactChildren } from './RouteUtils'

/**
 * A <RouterContext> renders the component tree for a given router state
 * and sets the history object and the current location in context.
 */
function RouterContext({
  router,
  location,
  routes,
  params,
  components,
  createElement = React.createElement
}) {
  let element = null

  if (components) {
    const createElementOrNull = (component, props) => (
      component == null ? null : createElement(component, props)
    )

    element = components.reduceRight((element, components, index) => {
      if (components == null)
        return element // Don't create new children; use the grandchildren.

      const route = routes[index]
      const routeParams = getRouteParams(route, params)
      const props = {
        location,
        params,
        route,
        router,
        routeParams,
        routes
      }

      if (isReactChildren(element)) {
        props.children = element
      } else if (element) {
        for (const prop in element)
          if (Object.prototype.hasOwnProperty.call(element, prop))
            props[prop] = element[prop]
      }

      if (!isValidElementType(components)) {
        invariant(
            typeof components === 'object',
            'A route component must be either a plain object or an element type.'
          )

        const elements = {}

        for (const key in components) {
          if (Object.prototype.hasOwnProperty.call(components, key)) {
              // Pass through the key as a prop to createElement to allow
              // custom createElement functions to know which named component
              // they're rendering, for e.g. matching up to fetched data.
            const component = components[key]
            elements[key] = createElementOrNull(component, {
              key, ...props
            })
          }
        }

        return elements
      }

      return createElementOrNull(components, props)
    }, element)
  }

  invariant(
      element === null || element === false || React.isValidElement(element),
      'The root route must render a single element'
    )

  return createElement(RouterReactContext.Provider, {
    value: router
  }, element)
}

RouterContext.propTypes = {
  router: object.isRequired,
  location: object.isRequired,
  routes: array.isRequired,
  params: object.isRequired,
  components: array.isRequired,
  createElement: func
}

export default RouterContext
