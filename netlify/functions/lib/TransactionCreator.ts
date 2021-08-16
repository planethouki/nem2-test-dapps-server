import {
    Account,
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
    TransferTransaction,
    UInt64
} from "symbol-sdk";
import {BuyRequestBody} from './BuyRequestBody';
import {NetworkConstants} from "./NetworkConstants";

export class TransactionCreator {

    private constants: NetworkConstants;

    constructor() {
        this.constants = new NetworkConstants(NetworkType.TEST_NET)
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

    createMintTransaction (): AggregateTransaction {
        const networkType: NetworkType = this.constants.networkType
        const minter: Account = this.constants.minter
        const epochAdjustment: number = this.constants.epochAdjustment

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
            minter.address,
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
        return tx
    }
}
