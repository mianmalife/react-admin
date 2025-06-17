export const isArray = (val: any) => Array.isArray(val)

export const getTreeFirstGrandson = (treeData: any, fields?: string): any => {
  if (!fields) {
    fields = 'key'
  }

  if (!treeData) {
    return
  }

  if (isArray(treeData) && treeData.length === 0) {
    return
  }

  if (!isArray(treeData)) {
    treeData = [treeData]
  }

  const firstItem = isArray(treeData[0].children) ? treeData[0].children : []
  if (firstItem.length > 0) {
    for (let i = 0; i < firstItem.length; i++) {
      if (firstItem[i].children?.length > 0) {
        return getTreeFirstGrandson(firstItem[i][0])
      } else {
        return firstItem[i][fields]
      }
    }
  } else {
    return null
  }
}

export const getPathPrefixes = (path: string) => {
  if (typeof path !== 'string') return [];
  // 清理路径：去掉首尾斜杠，统一分隔
  const parts = path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  const list = parts.map((_, i) => '/' + parts.slice(0, i + 1).join('/'))
  return list.slice(0, list.length - 1);
}
