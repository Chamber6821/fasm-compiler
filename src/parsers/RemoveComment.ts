export function removeComment(line: string): string {
    const pattern = /"[^"]*"/
    return line.replace(pattern, "")
}