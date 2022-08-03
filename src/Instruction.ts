type Count = number | undefined

export enum SignalName {
    Constant = "V",
    ReadFrom = "R",
    WriteTo = "W",
    Increment = "I",
    Condition = "C",
    Jump = "J",
    Device = "U",
    AskToDevice = "Q",
    GetFromDevice = "G",
    ExecDeviceMethod = "M",
    StatusCode = "S"
}

export const PermittedSignalNames = Object.values(SignalName)

export default class Instruction {
    constructor(
        public signals: Map<SignalName, number>
    ) {}
}