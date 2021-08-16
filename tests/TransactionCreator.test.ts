import { TransactionCreator } from '../netlify/functions/lib/TransactionCreator';
import { expect } from 'chai'

it('basic', () => {
    const builder = new TransactionCreator()
    expect(builder).to.instanceof(TransactionCreator)
});

