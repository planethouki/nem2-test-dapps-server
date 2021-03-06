import {Account, NetworkType, RepositoryFactoryHttp, TransactionRepository} from "symbol-sdk";

export class NetworkConstants {

    public networkType: NetworkType;
    public minter: Account;
    public generationHash: string;
    public epochAdjustment: number;
    private repository: RepositoryFactoryHttp;
    public transactionHttp: TransactionRepository;

    constructor(networkType: NetworkType) {
        if (networkType !== NetworkType.TEST_NET) {
            throw new Error('currently unsupported network type')
        }

        this.networkType = networkType
        this.minter = Account.createFromPrivateKey(
            "25B3F54217340F7061D02676C4B928ADB4395EB70A2A52D2A11E2F4AE011B03E",
            this.networkType
        )
        this.generationHash = "3B5E1FA6445653C971A50687E75E6D09FB30481055E3990C84B25E9222DC1155"
        this.epochAdjustment = 1616694977
        const endPoint = "https://dg0nbr5d1ohfy.cloudfront.net:443"
        this.repository = new RepositoryFactoryHttp(endPoint)
        this.transactionHttp = this.repository.createTransactionRepository()
    }
}
