export const isArray = (val: any) => Array.isArray(val)

export const getTreeFirstGrandson = (treeData: any, fields?: string): any => {
  if (!fields) {
    fields = 'key'
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