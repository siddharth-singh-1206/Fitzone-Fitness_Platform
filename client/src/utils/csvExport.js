/**
 * Universal CSV export utility for Admin tables.
 * Converts array of data objects to formatted CSV and triggers browser download.
 */
export function exportToCsv(filename, data, columns) {
  if (!data || !data.length) {
    alert('No data available to export.')
    return
  }

  // Header row
  const headers = columns.map((col) => `"${col.label.replace(/"/g, '""')}"`).join(',')

  // Data rows
  const rows = data.map((item) => {
    return columns
      .map((col) => {
        let val = typeof col.accessor === 'function' ? col.accessor(item) : item[col.accessor]
        if (val === null || val === undefined) val = ''
        const strVal = String(val).replace(/"/g, '""')
        return `"${strVal}"`
      })
      .join(',')
  })

  const csvContent = [headers, ...rows].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
