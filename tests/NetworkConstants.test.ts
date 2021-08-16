import {NetworkConstants} from '../netlify/functions/lib/NetworkConstants';
import {NetworkType, Transaction, TransactionHttp} from "symbol-sdk";
import { expect } from 'chai'

it('basic', () => {
    const n = new NetworkConstants(NetworkType.TEST_NET)
    expect(n).to.instanceof(NetworkConstants)
})

it('accepts only test net', () => {
    expect(() => new NetworkConstants(NetworkType.MIJIN_TEST)).to.throw()
})

it('has properties', () => {
    const n = new NetworkConstants(NetworkType.TEST_NET)
    expect(n.generationHash).eq("3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155")
    expect(n.minter.address.plain()).eq("TCZ5KXKSAJA74A5ECZCXMHOHKFVQ36YSONW4RSA")
    expect(n.networkType).eq(NetworkType.TEST_NET)
    expect(n.epochAdjustment).eq(1616694977)
    expect(n.transactionHttp).to.instanceof(TransactionHttp)
})
