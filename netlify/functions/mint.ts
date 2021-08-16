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

    const networkType: NetworkType = NetworkType.TEST_NET
    const repo: RepositoryFactoryHttp = new RepositoryFactoryHttp("https://dg0nbr5d1ohfy.cloudfront.net:443")
    const transactionHttp: TransactionRepository = repo.createTransactionRepository()

    const constants: NetworkConstants = new NetworkConstants(NetworkType.TEST_NET)
    const minter: Account = constants.minter
    const generationHash: string = constants.generationHash
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
