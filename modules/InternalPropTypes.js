import { isValidElementType } from 'react-is'
import { func, object, arrayOf, oneOfType, element, shape } from 'prop-types'

export function falsy(props, propName, componentName) {
  if (props[propName])
    return new Error(`<${componentName}> should not have a "${propName}" prop`)
}

export const history = shape({
  listen: func.isRequired,
  push: func.isRequired,
  replace: func.isRequired,
  go: func.isRequired,
  goBack: func.isRequired,
  goForward: func.isRequired
})

export const component = (props, propName, componentName) => {
  if (Object.prototype.hasOwnProperty.call(props, propName) && !isValidElementType(props[propName])) {
    throw new Error(`Invalid prop \`${propName}\` supplied to \`${componentName}\`.`)
  }
}
component.isRequired = (props, propName, componentName) => {
  if (!Object.prototype.hasOwnProperty.call(props, propName)) {
    throw new Error(`Prop \`${propName}\` is required in \`${componentName}\`.`)
  }
  return component(props, propName, componentName)
}
export const components = oneOfType([ component, object ])
export const route = oneOfType([ object, element ])
export const routes = oneOfType([ route, arrayOf(route) ])
