import { Handler } from "@netlify/functions";
import {
    Account,
    Address,
    AggregateTransaction,
    Deadline, KeyGenerator, Mosaic,
    MosaicDefinitionTransaction,
    MosaicFlags,
    MosaicId, MosaicMetadataTransaction,
    MosaicNonce, MosaicSupplyChangeAction, MosaicSupplyChangeTransaction, NetworkType, PlainMessage, PublicAccount,
    RepositoryFactoryHttp, SignedTransaction, TransferTransaction, UInt64
} from "symbol-sdk";

type RequestBody = {
    publicKey: string,
    mosaicId: string
}

const handler: Handler = async (event, context) => {

    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST"
            }
        };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405
        }
    }

    if (typeof event.body !== "string") {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "body required"
            })
        }
    }

    const body: RequestBody = JSON.parse(event.body)

    if (body.mosaicId === "" || body.publicKey === "") {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "invalid body"
            })
        }
    }

    const networkType: NetworkType = NetworkType.TEST_NET
    const recipient: PublicAccount = PublicAccount.createFromPublicKey(body.publicKey, networkType)
    const currencyMosaicId: string = "091F837E059AE13C"
    const minter: Account = Account.createFromPrivateKey("25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E", networkType)
    const epochAdjustment: number = 1616694977
    const generationHash: string = "3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155"
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
        minter.address,
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

    const signedTx: SignedTransaction = minter.sign(tx, generationHash)

    return {
        statusCode: 200,
        headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "POST"
        },
        body: JSON.stringify(signedTx),
    };
};

export { handler };
