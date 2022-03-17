import { traverse } from '@atlaskit/adf-utils'
import { isEmpty } from 'lodash'

import logger from './log'

const suppMarks = ['strong', 'em', 'underline', 'link']
const suppSpecialNodes = ['heading','panel', 'expand']
const exclMarks = ['code']
const exclSpecialNodes = ['codeBlock']

export function convert(content) {
  if (!content) {
    return null
  }

  let text = ''
  const metadata = {}
  const doc = toAdfDoc(content.body)

  if (!doc) {
    return null
  }

  const title = content.title
  if (title){
    const startPos = text.length
    const endPos = startPos + title.length
    text += (title + ' ')
    addToMetadata({ type: 'title' }, startPos, endPos, metadata)
  }

  traverse(doc, {
    text: (node, parent) => {
      let nodeText = node.text.trim()
      let exclude = false
      const startPos = text.length
      const endPos = startPos + nodeText.length

      const specialParentType = processParent(parent)
      if (specialParentType) {
        exclude = exclSpecialNodes.includes(specialParentType.type)
        if (!exclude) {
          exclude = processNodeMarks(node, startPos, endPos, metadata, exclude)
          if (!exclude) {
            addToMetadata(specialParentType, startPos, endPos, metadata)
          }
        }
      } else {
        exclude = processNodeMarks(node, startPos, endPos, metadata, exclude)
      }

      if (!exclude) {
        text += (nodeText + ' ')
      }
    }
  })

  return { text, metadata}
}

const processNodeMarks = (node, startPos, endPos, metadata, exclude) => {
  const nodeMarks = node.marks
  if (nodeMarks) {
    exclude = !isEmpty(nodeMarks.filter(mark => exclMarks.includes(mark.type)))
    if (!exclude){
      nodeMarks.forEach(mark => {
        if (processMark(mark)) {
          addToMetadata({ type: mark.type }, startPos, endPos, metadata)
        }
      })
    }
  }

  return exclude
}

const addToMetadata = (type, start, end, metadata) => {
  let mainType = type.type
  if (!type.spec) {
    if(!metadata.hasOwnProperty(mainType)) {
      metadata[mainType] = []
    }
    metadata[mainType].push({ start, end })
  } else {
    if(!metadata.hasOwnProperty(mainType)) {
      metadata[mainType] = {}
    }
    let specType = type.spec
    let metadataMainType = metadata[mainType]
    if(!metadataMainType.hasOwnProperty(specType)) {
      metadataMainType[specType] = []
    }
    metadataMainType[specType].push({ start, end })
  }
}

const processMark = (mark) => {
  return mark && suppMarks.includes(mark.type)
}

const processParent = (parent) => {
  if (parent) {
    const topParent = getTopParent(parent.node, parent.parent)
    if (!topParent) {
      return null
    }
    const topParentType = topParent.type
    if (topParentType && (suppSpecialNodes.includes(topParentType) || exclSpecialNodes.includes(topParentType))) {
        return getNodeTypeWithAttrs(topParent)
    }
  }
  return null
}

const getNodeTypeWithAttrs = (node) => {
  let result = { type: node.type, spec: null }
  if (exclSpecialNodes.includes(node.type)) {
    return result
  } else if (node.type === 'heading') {
    if (!node.attrs) {
      return result
    }
    result.spec = `h${node.attrs.level}`
  } else if (node.type === 'panel') {
    if (!node.attrs) {
      return result
    }
    result.spec = node.attrs.panelType
  }
  return result
}

const getTopParent = (node, parent) => {
  if (!parent || parent.node.type === 'doc') {
    return node
  } else if (isHighestNode(parent)) {
    return parent.node
  } else {
    return getTopParent(parent.node, parent.parent)
  }
}

const isHighestNode = (node) => {
  return node.parent.type !== 'doc'
}

const toAdfDoc = (body) => {
  try {
    return JSON.parse(body)
  } catch(err) {
    logger.error(err.message)
    return null
  }
}
