import { readdir, readFile } from 'node:fs/promises'
import { join, sep } from 'node:path'
import { lexer, parse, walk } from 'css-tree'
import { parse as parseComponent } from 'vue/compiler-sfc'

const tokenStylesheet = 'src/assets/css/main.css'
const paintAttributes = /^(?:color|fill|stroke|stop-color|flood-color|lighting-color)$/
const colorFunctions = /^(?:rgba?|hsla?|hwb|ok?lab|ok?lch|color|device-cmyk)$/
const colorProperties =
  /(?:color|^fill$|^stroke$|^background$|^background-image$|^border(?:-(?:top|right|bottom|left|block|inline)(?:-(?:start|end))?)?$|^outline$|^box-shadow$|(?:^text-shadow$|^text-stroke$|^-webkit-text-stroke$)|^text-decoration$|^filter$|^--)/

function isLiteralColor(node, checkNames) {
  if (node.type === 'Hash') return /^(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(node.value)
  if (node.type === 'Function') return colorFunctions.test(node.name.toLowerCase())
  return (
    checkNames &&
    node.type === 'Identifier' &&
    lexer.matchType('named-color', node).matched !== null
  )
}

function checkFile(file, source) {
  let failed = false

  function report(offset, value) {
    const line = source.slice(0, offset).split('\n').length
    const column = offset - source.lastIndexOf('\n', offset - 1)
    console.error(`${file}:${line}:${column} Use a shared color token for ${value}`)
    failed = true
  }

  function checkValue(ast, text, offset, checkNames) {
    walk(ast, {
      enter(node) {
        if (!isLiteralColor(node, checkNames)) return
        const { start, end } = node.loc
        report(offset + start.offset, text.slice(start.offset, end.offset))
        return this.skip
      },
    })
  }

  function checkCss(css, offset, context = 'stylesheet') {
    const ast = parse(css, { context, positions: true, parseCustomProperty: true })
    walk(ast, {
      visit: 'Declaration',
      enter({ property, value }) {
        if (
          file === tokenStylesheet &&
          this.atrule?.name === 'theme' &&
          !this.rule &&
          property.startsWith('--color-')
        ) {
          return
        }
        checkValue(value, css, offset, colorProperties.test(property.toLowerCase()))
      },
    })
  }

  function checkMarkup(node, adjustment) {
    for (const child of node.children ?? []) {
      if (!child.props) continue
      for (const prop of child.props) {
        const name = prop.name === 'bind' && prop.arg?.isStatic ? prop.arg.content : prop.name
        const value = prop.value ?? prop.exp
        if (!value || (!paintAttributes.test(name) && name !== 'style' && name !== 'class'))
          continue
        const offset = adjustment + value.loc.start.offset
        if (prop.name === 'bind') {
          // Vue parses the expression with a leading parenthesis.
          checkBinding(name, value.ast, offset - 1)
        } else {
          const quoted = /^['"]/.test(value.loc.source)
          checkAttribute(
            name,
            quoted ? value.loc.source.slice(1, -1) : value.loc.source,
            offset + Number(quoted),
          )
        }
      }
      if (child.tag === 'style') {
        for (const text of child.children) {
          checkCss(text.loc.source, adjustment + text.loc.start.offset)
        }
      }
      checkMarkup(child, adjustment)
    }
  }

  function checkBinding(name, expression, offset) {
    switch (expression?.type) {
      case 'StringLiteral':
        checkAttribute(name, expression.value, offset + expression.start + 1)
        break
      case 'ConditionalExpression':
        checkBinding(name, expression.consequent, offset)
        checkBinding(name, expression.alternate, offset)
        break
      case 'LogicalExpression':
        checkBinding(name, expression.left, offset)
        checkBinding(name, expression.right, offset)
        break
      case 'ArrayExpression':
        for (const item of expression.elements) checkBinding(name, item, offset)
        break
      case 'ObjectExpression':
        for (const prop of expression.properties) {
          if (prop.type !== 'ObjectProperty') continue
          if (name === 'style') {
            const property = prop.key.name ?? prop.key.value
            if (typeof property === 'string') checkBinding(property, prop.value, offset)
          } else if (name === 'class') {
            checkBinding(name, prop.key, offset)
          }
        }
        break
    }
  }

  function checkPaint(value, offset, checkNames = true) {
    const ast = parse(value, { context: 'value', positions: true, parseCustomProperty: true })
    checkValue(ast, value, offset, checkNames)
  }

  function checkAttribute(name, value, offset) {
    if (name === 'style') {
      checkCss(value, offset, 'declarationList')
    } else if (name === 'class') {
      for (const match of value.matchAll(/(?:^|[\s:])!?([\w-]+-)?\[([^\]]+)\](?!:)/g)) {
        const start = offset + match.index + match[0].indexOf('[') + 1
        const arbitraryValue = match[2].replaceAll('_', ' ')
        if (!match[1]) {
          checkCss(arbitraryValue, start, 'declarationList')
        } else if (
          /^(?:bg|fill|stroke|text|border|outline|shadow|ring|decoration|accent|caret|from|via|to)-/.test(
            match[1],
          )
        ) {
          checkPaint(arbitraryValue, start)
        }
      }
    } else {
      const property = name.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase())
      checkPaint(value, offset, colorProperties.test(property))
    }
  }

  if (file.endsWith('.css')) {
    checkCss(source, 0)
  } else {
    const svg = file.endsWith('.svg')
    const { descriptor } = parseComponent(svg ? `<template>${source}</template>` : source)
    for (const style of descriptor.styles) checkCss(style.content, style.loc.start.offset)
    if (descriptor.template?.ast)
      checkMarkup(descriptor.template.ast, svg ? -'<template>'.length : 0)
  }

  return failed
}

for (const root of ['src', 'public']) {
  const files = await readdir(root, { recursive: true, withFileTypes: true })
  for (const entry of files) {
    if (!entry.isFile() || !/\.(?:css|svg|vue)$/.test(entry.name)) continue
    const file = join(entry.parentPath, entry.name).split(sep).join('/')
    if (file.startsWith('src/dev/')) continue
    if (checkFile(file, await readFile(file, 'utf8'))) process.exitCode = 1
  }
}

if (!process.exitCode) console.log('Lesson palette check passed.')
