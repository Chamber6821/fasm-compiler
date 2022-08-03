import Instruction, { SignalName } from "./Instruction"


export default class Translator {
    private readonly instructions: Instruction[] = []
    /*private*/ readonly labels = new Map<string, number>()
    private readonly deferredJumps = new Map<string, Instruction[]>()

    translate(): Instruction[] {
        return this.instructions
    }

    addToTranslation(labels: string[], signals: Map<SignalName, number>, jumpTo: string | null) {
        this.updateLabels(this.getNextInstructionAddress(), labels)

        if (signals.size === 0 && jumpTo === null) return

        const instruction = new Instruction(signals)
        this.instructions.push(instruction)

        if (jumpTo === null) return

        this.markDeferred(instruction, jumpTo)
        this.tryLinkDeferredJumps(jumpTo)
    }

    private getNextInstructionAddress(): number {
        return this.instructions.length
    }

    private updateLabels(address: number, labels: string[]) {
        for (const label of labels) {
            this.labels.set(label, address)
            this.tryLinkDeferredJumps(label)
        }
    }

    private markDeferred(instruction: Instruction, label: string) {
        const list = this.deferredJumps.get(label) || []
        list.push(instruction)
        this.deferredJumps.set(label, list)
    }

    private tryLinkDeferredJumps(label: string): boolean {
        const deferred = this.deferredJumps.get(label) || []
        const address = this.labels.get(label)

        if (address === undefined) return false

        for (const instruction of deferred) {
            instruction.signals.set(SignalName.Jump, address)
        }

        this.deferredJumps.delete(label)
        return true
    }
}