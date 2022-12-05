import { IShikiPlugin, IShikiPluginContext } from './types'

export function applyPlugins(
  type: string,
  context: IShikiPluginContext,
  plugins: IShikiPlugin[],
  props: any
): any {
  let attributes: Record<string, string | Boolean> = {}
  let attributeString = ''
  let classNames = props.className || ''
  let styles: Record<string, string> = {}
  let styleString = ''

  if (props.style) {
    props.style.split(';').every((styleString: string) => {
      if (styleString === '') false
      const [key, value] = styleString.split(':')
      styles[key] = value.replaceAll(';', '')
    })
  }

  context = {
    ...context,
    ...{ index: props.index },
    ...{ line: props.line },
    ...{ lines: props.lines },
    ...{ token: props.token },
    ...{ tokens: props.tokens }
  }

  for (const plugin of plugins) {
    if (plugin.tags?.[type]) {
      const pluginInput = plugin.tags[type]

      switch (type) {
        case 'pre':
        case 'line':
        case 'token':
          classNames = getClassNames(pluginInput.classNames, classNames, context)
          styles = getStyles(pluginInput.styles, styles, context)
        default:
          attributes = getAttributes(pluginInput.attributes, context)
          break
      }
    }
  }

  for (const [key, value] of Object.entries(attributes)) {
    const attribute = typeof value === 'boolean' ? `${key}` : `${key}="${value}"`
    attributeString += ' ' + attribute
  }

  for (const [key, value] of Object.entries(styles)) {
    styleString += `${key.trim()}: ${value.trim()}; `
  }

  return {
    ...props,
    className: classNames,
    style: styleString.trim(),
    attributes: attributeString
  }
}

function getAttributes(
  pluginInput: Record<string, string> | Function,
  context: IShikiPluginContext
): Record<string, string> {
  if (!pluginInput) return {}

  let attributes = {}

  if (typeof pluginInput === 'function') {
    attributes = pluginInput.call(this, context)
  } else if (typeof pluginInput === 'object') {
    attributes = pluginInput
  }

  return attributes
}

function getClassNames(
  pluginInput: string[] | Function,
  classNames: string,
  context: IShikiPluginContext
): string {
  if (!pluginInput) return classNames

  let newClassNames = []
  if (typeof pluginInput === 'function') {
    newClassNames = pluginInput.call(this, context)
  } else if (typeof pluginInput === 'object' && Array.isArray(pluginInput)) {
    newClassNames = pluginInput
  }

  return (classNames + ' ' + newClassNames.join(' ')).trim()
}

function getStyles(
  pluginInput: Record<string, string> | Function,
  styles: Record<string, string>,
  context: IShikiPluginContext
): Record<string, string> {
  if (!pluginInput) return styles

  if (typeof pluginInput === 'function') {
    styles = { ...styles, ...pluginInput.call(this, context) }
  } else if (typeof pluginInput === 'object') {
    styles = { ...styles, ...pluginInput }
  }

  return styles
}
