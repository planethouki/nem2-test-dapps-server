import {
    Account,
    AggregateTransaction,
    Deadline,
    Mosaic, MosaicId,
    NetworkType, PlainMessage,
    PublicAccount,
    TransferTransaction, UInt64
} from "symbol-sdk";
import {BuyRequestBody} from './BuyRequestBody';

export class TransactionCreator {

    constructor() {
    }

    createBuyTransaction (body: BuyRequestBody): AggregateTransaction {

        const networkType: NetworkType = NetworkType.TEST_NET
        const recipient: PublicAccount = PublicAccount.createFromPublicKey(body.publicKey, networkType)
        const currencyMosaicId: string = "091F837E059AE13C"
        const minter: Account = Account.createFromPrivateKey("25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E", networkType)
        const epochAdjustment: number = 1616694977
        const nftMosaicId: string = body.mosaicId

        const paymentTx: TransferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            minter.address,
            [new Mosaic(new MosaicId(currencyMosaicId), UInt64.fromUint(500 * 1000000))],
            PlainMessage.create(""),
            networkType
        )
        const deliveryTx: TransferTransaction = TransferTransaction.create(
            Deadline.create(epochAdjustment),
            recipient.address,
            [new Mosaic(new MosaicId(nftMosaicId), UInt64.fromUint(1))],
            PlainMessage.create(""),
            networkType
        )
        const tx: AggregateTransaction = AggregateTransaction.createComplete(
            Deadline.create(epochAdjustment),
            [
                paymentTx.toAggregate(recipient),
                deliveryTx.toAggregate(minter.publicAccount)
            ],
            networkType,
            [],
            UInt64.fromUint(20000000),
        )

        return tx
    }
}
