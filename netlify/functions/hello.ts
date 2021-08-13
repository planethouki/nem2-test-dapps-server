import { Handler } from "@netlify/functions";

type Hoge = {
    hoge: string
}

const handler: Handler = async (event, context) => {
    console.log(event)
    if (typeof event.body === "string") {
        const parse: Hoge = JSON.parse(event.body)
        console.log(parse)
    }
    return {
        statusCode: 200,
        headers: {
            'content-type': "application/json"
        },
        body: JSON.stringify({ message: "Hello World" }),
    };
};

export { handler };
