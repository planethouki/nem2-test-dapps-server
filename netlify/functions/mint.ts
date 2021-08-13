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


const handler: Handler = async (event, context) => {

    const networkType: NetworkType = NetworkType.TEST_NET
    const minter: Account = Account.createFromPrivateKey("25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E", networkType)
    const recipient: PublicAccount = minter.publicAccount
    const epochAdjustment: number = 1616694977
    const generationHash: string = "3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155"
    const repo: RepositoryFactoryHttp = new RepositoryFactoryHttp("https://dg0nbr5d1ohfy.cloudfront.net:443")
    const transactionHttp: TransactionRepository = repo.createTransactionRepository()

    const [isSupplyMutable, isTransferable, isRestrictable ] = [false, true, false]
    const nonce: MosaicNonce = MosaicNonce.createRandom()
    const mosaicDefinitionTx: MosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
        Deadline.create(epochAdjustment),
        nonce,
        MosaicId.createFromNonce(nonce, minter.address),
        MosaicFlags.create(isSupplyMutable, isTransferable, isRestrictable),
        0,
        UInt64.fromUint(0),
        networkType
    )
    const mosaicSupplyChangeTx: MosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
        Deadline.create(epochAdjustment),
        mosaicDefinitionTx.mosaicId,
        MosaicSupplyChangeAction.Increase,
        UInt64.fromUint(1),
        networkType,
    )
    const metadataTx: MosaicMetadataTransaction = MosaicMetadataTransaction.create(
        Deadline.create(epochAdjustment),
        recipient.address,
        KeyGenerator.generateUInt64Key('Primitives'),
        mosaicDefinitionTx.mosaicId,
        3,
        "NFT",
        networkType,
    );
    const tx: AggregateTransaction = AggregateTransaction.createComplete(
        Deadline.create(epochAdjustment),
        [
            mosaicDefinitionTx.toAggregate(minter.publicAccount),
            mosaicSupplyChangeTx.toAggregate(minter.publicAccount),
            metadataTx.toAggregate(minter.publicAccount)
        ],
        networkType,
        [],
        UInt64.fromUint(20000000),
    )

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
