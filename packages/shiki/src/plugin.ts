import { createHook } from 'async_hooks'
import { IShikiPlugin, IShikiPluginContext } from './types'

const TAGS = ['pre', 'code', 'line', 'token']
const HOOKs = ['before', 'after']

export function applyPluginHooks(
  hook: string,
  context: IShikiPluginContext,
  plugins: IShikiPlugin[],
  inputs: any,
  elementType?: string
): any {
  if (HOOKs.includes(hook)) {
    return applyHooks(hook, context, plugins, inputs, elementType)
  }

  return inputs
}

export function applyPluginTags(
  type: string,
  context: IShikiPluginContext,
  plugins: IShikiPlugin[],
  inputs: any
) {
  if (!TAGS.includes(type)) return inputs

  let attributes: Record<string, string | Boolean> = {}
  let attributeString = ''
  let classNames = inputs.className || ''
  let styles: Record<string, string> = {}
  let styleString = ''

  if (inputs.style) {
    inputs.style.split(';').every((styleString: string) => {
      if (styleString === '') false
      const [key, value] = styleString.split(':')
      styles[key] = value.replaceAll(';', '')
    })
  }

  context = {
    ...context,
    ...{ index: inputs.index },
    ...{ line: inputs.line },
    ...{ lines: inputs.lines },
    ...{ token: inputs.token },
    ...{ tokens: inputs.tokens }
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
    props: {
      ...inputs,
      className: classNames,
      style: styleString.trim(),
      attributes: attributeString
    },
    plugins
  }
}

function applyHooks(
  hook: string,
  context: IShikiPluginContext,
  plugins: IShikiPlugin[],
  inputs: any,
  elementType?: string
) {
  let keyIn = `${hook === 'before' ? 'tokens' : 'html'}`

  for (const plugin of plugins) {
    if (plugin.hooks?.[hook]) {
      const pluginInput = plugin.hooks[hook]
      let state = plugin?.state ? plugin.state : {}
      ;({ state, [keyIn]: inputs } = pluginInput.call(this, {
        context,
        state,
        ...{ elementType, [keyIn]: inputs }
      }))
      plugin.state = { ...plugin.state, ...state }
    }
  }

  const keyOut = `${hook === 'before' ? 'lines' : 'el'}`
  return { [keyOut]: inputs, plugins }
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
