import {Handler} from "@netlify/functions";
import {Account, NetworkType, SignedTransaction} from "symbol-sdk";
import {BuyRequestBody} from "./lib/BuyRequestBody";
import {TransactionCreator} from "./lib/TransactionCreator";


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

    const minter: Account = Account.createFromPrivateKey(
        "25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E",
        NetworkType.TEST_NET
    )
    const generationHash: string = "3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155"
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
