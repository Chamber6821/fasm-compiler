export function parseLabels(line: string): string[] {
    const pattern = /([^\s(:]+):/gi
    const matches = [...line.matchAll(pattern)]
    return matches.map(match => match[1])
}