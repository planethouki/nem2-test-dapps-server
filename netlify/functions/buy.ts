import {Handler} from "@netlify/functions";
import {Account, NetworkType, SignedTransaction} from "symbol-sdk";
import {BuyRequestBody} from "./lib/BuyRequestBody";
import {TransactionCreator} from "./lib/TransactionCreator";
import {NetworkConstants} from "./lib/NetworkConstants";


const corsHeaders: { [key: string]: string } = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*"
}

const handler: Handler = async (event, context) => {

    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                ...corsHeaders
            }
        };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: {
                ...corsHeaders
            }
        }
    }

    if (typeof event.body !== "string") {
        return {
            statusCode: 400,
            headers: {
                ...corsHeaders
            },
            body: JSON.stringify({
                message: "body required"
            })
        }
    }

    const body: BuyRequestBody = JSON.parse(event.body)

    if (body.mosaicId === "" || body.publicKey === "") {
        return {
            statusCode: 400,
            headers: {
                ...corsHeaders
            },
            body: JSON.stringify({
                message: "invalid body"
            })
        }
    }

    const constants: NetworkConstants = new NetworkConstants(NetworkType.TEST_NET)
    const minter: Account = constants.minter
    const generationHash: string = constants.generationHash
    const creator = new TransactionCreator()

    const tx = creator.createBuyTransaction(body)
    const signedTx: SignedTransaction = minter.sign(tx, generationHash)

    return {
        statusCode: 200,
        headers: {
            "content-type": "application/json",
            ...corsHeaders
        },
        body: JSON.stringify(signedTx),
    };
};

export { handler };
