import { PermittedSignalNames, SignalName } from "../Instruction"


export function parseSignals(line: string): Map<SignalName, number> {
    const pattern = /([A-Z])([+-]?[0-9]+)/g
    const matches = [...line.matchAll(pattern)]
    return validateSignals(matches.map(match => [match[1], parseInt(match[2])]))
}

function validateSignals(signals: [string, number][]): Map<SignalName, number> {
    if (hasDuplicated(signals.map(p => p[0]))) {
        console.log(signals)
        throw new Error("Has duplicated signals")
    }

    const map = new Map(signals)

    for (const key of map.keys()) {
        if (!PermittedSignalNames.includes(key as SignalName)) {
            console.log("Permitted:", PermittedSignalNames)
            console.log("Got:", signals)
            throw new Error(`Contains denied signal "${key}"`)
        }
    }

    return map as Map<SignalName, number>
}

function hasDuplicated<T>(arr: T[]): boolean {
    return new Set(arr).size !== arr.length
}
