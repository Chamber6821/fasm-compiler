import { readFileSync }            from "fs"
import Signal                      from "make-factorio-blueprint/Signal"
import encode                      from "make-factorio-blueprint/utils/encode"
import BlueprintBuilder            from "./BlueprintBuilder"
import Instruction, { SignalName } from "./Instruction"
import { parseJumpLabel }          from "./parsers/ParseJumpLabel"
import { parseLabels }             from "./parsers/ParseLabels"
import { parseSignals }            from "./parsers/ParseSignals"
import { removeComment }           from "./parsers/RemoveComment"
import Translator                  from "./Translator"


function toLines(multiline: string): string[] {
    return multiline.match(/[^;]+/g) || []
}

function unbracketCommandValue(line: string): string {
    const regex = /([a-z])\(([+\-]?\d+)\)/gi

    let newLine = line
    while (true) {
        const match = regex.exec(line)
        if (match === null) break

        const prefix = match[1]
        const value = match[2]
        newLine = newLine.replace(match[0], prefix + value)
    }
    return newLine
}

function wrapConstant(line: string): string {
    const regex = /(\W|^)([+\-]?\d+)/
    const match = line.match(regex)
    if (match == null) return line

    return line.replace(regex, "V" + match[2])
}

function printInstruction(instruction: Instruction) {
    let line = ""

    for (const [alpha, value] of instruction.signals.entries()) {
        line += alpha + value + " "
    }

    //console.log("Jump:", instruction.signals.get(SignalName.Jump))
    console.log(line)
}

const code = readFileSync("D:\\Games\\Факторка\\translator\\build\\main.fasm", { encoding: "utf8", flag: "r" });
`
 1 => W(1);
 __dwl4: R(1) => (U1 M1); 2 => (U1 M2); (U1 G3) => W(1); (R(1) C4) J(__dwl4);
`

const lines = toLines(code)
    .map(removeComment)
    .map(unbracketCommandValue)
    .map(wrapConstant)
    .map(s => s.trim())
    .filter(s => s.length > 0)

const translator = new Translator()
lines.forEach(l => translator.addToTranslation(parseLabels(l), parseSignals(l), parseJumpLabel(l)))

console.log(translator.translate().length)
if (lines.length <= 10) console.log(lines)
if (translator.translate().length <= 10) translator.translate().forEach(printInstruction)
console.log(translator.labels)

//process.exit(0)

const icons = ([..."PROG"] as SignalName[]).map(Signal.virtual)
const builder = new BlueprintBuilder("Program", icons)
translator.translate().forEach(i => builder.addInstruction(i))

console.log(encode(builder.getBlueprint()))

//TODO: Разбить на модули из конвейеров функций
