import Blueprint          from "make-factorio-blueprint/Blueprint"
import makeConnection     from "make-factorio-blueprint/connection/makeConnection"
import ConstantCombinator from "make-factorio-blueprint/entities/ConstantCombinator"
import DeciderCombinator  from "make-factorio-blueprint/entities/DeciderCombinator"
import SmallLamp          from "make-factorio-blueprint/entities/SmallLamp"
import Position           from "make-factorio-blueprint/Position"
import Signal             from "make-factorio-blueprint/Signal"
import Instruction        from "./Instruction"


export default class BlueprintBuilder {
    private readonly blueprint: Blueprint
    private lastInstruction?: [SmallLamp, ConstantCombinator, DeciderCombinator]
    private count = 0

    constructor(
        name: string,
        icons: Signal[]
    ) {
        this.blueprint = new Blueprint(name, icons)
    }

    addInstruction(instruction: Instruction) {
        const [indicator, constantCombinator, filter] = this.getNewTemplate()

        for (const [signal, count] of instruction.signals.entries()) {
            constantCombinator.addFilter(Signal.virtual(signal), count)
        }

        this.lastInstruction = [indicator, constantCombinator, filter]
        this.count++
    }

    getBlueprint(): Blueprint {
        return this.blueprint
    }

    private getNewTemplate(): [SmallLamp, ConstantCombinator, DeciderCombinator] {
        const indicator = this.createIndicator()
        const constantCombinator = this.createConstantCombinator()
        const filter = this.createFilter()
        this.connectWithPreviousInstruction(indicator, filter)

        makeConnection()
            .from(indicator, "1")
            .to(filter, "1")
            .withGreenWire()

        makeConnection()
            .from(constantCombinator, "1")
            .to(filter, "1")
            .withRedWire()

        return [indicator, constantCombinator, filter]
    }

    private connectWithPreviousInstruction(indicator: SmallLamp, filter: DeciderCombinator) {
        if (!this.lastInstruction) return

        const [prevIndicator, , prevFilter] = this.lastInstruction

        makeConnection()
            .from(prevIndicator, "1")
            .to(indicator, "1")
            .withRedWire()

        makeConnection()
            .from(prevFilter, "1")
            .to(filter, "1")
            .withGreenWire()

        makeConnection()
            .from(prevFilter, "2")
            .to(filter, "2")
            .withRedWire()
    }

    private createIndicator(): SmallLamp {
        const indicator = this.blueprint.createEntity(id => new SmallLamp(id))
        indicator.position = new Position(0, this.count)
        return indicator.setLeft(Signal.virtual("T"))
                        .setComparator("=")
                        .setRight(this.count)
                        .useColors()
    }

    private createConstantCombinator(): ConstantCombinator {
        const constantCombinator = this.blueprint.createEntity(id => new ConstantCombinator(id))
        constantCombinator.position = new Position(1, this.count)
        constantCombinator.direction = 2
        constantCombinator.addFilter(Signal.virtual("T"), -this.count)
        return constantCombinator
    }

    private createFilter(): DeciderCombinator {
        const filter = this.blueprint.createEntity(id => new DeciderCombinator(id))
        filter.position = new Position(2.5, this.count)
        filter.direction = 2
        return filter.setLeft(Signal.virtual("T"))
                     .setComparator("=")
                     .setRight(0)
                     .setOutput(Signal.virtual("everything"))
    }
}