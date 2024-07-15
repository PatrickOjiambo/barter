import { Data } from "effect";

export class GeneratePortalDefinitionError extends Data.TaggedError("GeneratePortalDefinitionError")<{
    initialError: any
}> {

}

export class PortalDeserializerError extends Data.TaggedError("PortalDeserializerError")<{
    initialError: any
}> {

}

export class UnableToFetchNewPortalError extends Data.TaggedError("UnableToFetchNewPortalError")<{
    initialError: any
}> {

}


export class TransactionBuildError extends Data.TaggedError("TransactionBuildError")<{
    originalError: any
}> { }

export class TransactionSimulationError extends Data.TaggedError("TransactionSimulationError")<{
    originalError: any
}> { }

export class TransactionSubmissionError extends Data.TaggedError("TransactionSubmissionError")<{
    originalError: any
}> { }

export class TransactionWaitError extends Data.TaggedError("TransactionWaitError")<{
    originalError: any
}> { }

export class TransactionFailedError extends Data.TaggedError("TransactionFailedError")<{
    originalError: any
}> { }