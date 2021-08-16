import { Handler } from "@netlify/functions";
import {
    Account,
    Address,
    AggregateTransaction,
    Deadline,
    KeyGenerator,
    Mosaic,
    MosaicDefinitionTransaction,
    MosaicFlags,
    MosaicId,
    MosaicMetadataTransaction,
    MosaicNonce,
    MosaicSupplyChangeAction,
    MosaicSupplyChangeTransaction,
    NetworkType,
    PlainMessage,
    PublicAccount,
    RepositoryFactoryHttp,
    SignedTransaction,
    TransactionAnnounceResponse,
    TransactionHttp,
    TransactionRepository,
    TransferTransaction,
    UInt64
} from "symbol-sdk";
import {NetworkConstants} from "./lib/NetworkConstants";
import {TransactionCreator} from "./lib/TransactionCreator";


const handler: Handler = async (event, context) => {


    const constants: NetworkConstants = new NetworkConstants(NetworkType.TEST_NET)
    const minter: Account = constants.minter
    const generationHash: string = constants.generationHash
    const transactionHttp: TransactionRepository = constants.transactionHttp
    const creator = new TransactionCreator()

    const tx = creator.createMintTransaction()
    const signedTx: SignedTransaction = minter.sign(tx, generationHash)

    const announceResponse: TransactionAnnounceResponse
        = await transactionHttp.announce(signedTx).toPromise()

    const result: any = {
        ...signedTx,
        announceResponse
    }

    return {
        statusCode: 200,
        headers: {
            'content-type': "application/json"
        },
        body: JSON.stringify(result),
    };
};

export { handler };
