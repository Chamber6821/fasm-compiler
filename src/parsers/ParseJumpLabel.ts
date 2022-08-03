export function parseJumpLabel(line: string): string | null {
    const pattern = /J\((.+?)\)/
    const match = line.match(pattern) || []
    return match[1] || null
}