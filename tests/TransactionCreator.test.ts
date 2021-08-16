import { TransactionCreator } from '../netlify/functions/lib/TransactionCreator';
import { expect } from 'chai'
import {Account, AggregateTransaction, InnerTransaction, NetworkType, TransferTransaction} from "symbol-sdk";
import {BuyRequestBody} from "../netlify/functions/lib/BuyRequestBody";

const minter: Account = Account.createFromPrivateKey(
    "25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E",
    NetworkType.TEST_NET
)

const recipient: Account = Account.createFromPrivateKey(
    "35B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E",
    NetworkType.TEST_NET
)

const currencyMosaicId = "091F837E059AE13C"

it('basic', () => {
    const builder = new TransactionCreator()
    expect(builder).to.instanceof(TransactionCreator)
});

it('createBuyTransaction', () => {
    const body: BuyRequestBody = {
        mosaicId: 'FFFFFFFFFFFFFFFF',
        publicKey: recipient.publicKey
    }
    const tx: AggregateTransaction = new TransactionCreator().createBuyTransaction(body)
    const inner1: InnerTransaction = tx.innerTransactions[0]
    const inner2: InnerTransaction = tx.innerTransactions[1]
    // sender public key
    expect(inner1.signer?.publicKey).eq(body.publicKey)
    expect(inner2.signer?.publicKey).eq(minter.publicKey)
    const trans1: TransferTransaction = <TransferTransaction>inner1
    const trans2: TransferTransaction = <TransferTransaction>inner2
    // recipient address
    expect(trans1.recipientAddress.plain()).eq(minter.address.plain())
    expect(trans2.recipientAddress.plain()).eq(recipient.address.plain())
    // mosaic id
    expect(trans1.mosaics[0].id.toHex()).eq(currencyMosaicId)
    expect(trans2.mosaics[0].id.toHex()).eq(body.mosaicId)
    // mosaic amount
    expect(trans1.mosaics[0].amount.compact()).eq(500 * 1E+6)
    expect(trans2.mosaics[0].amount.compact()).eq(1)
})

