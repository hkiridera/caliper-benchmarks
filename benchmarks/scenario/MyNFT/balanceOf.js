'use strict';

const { WorkloadModuleInterface } = require('@hyperledger/caliper-core');
const SimpleState = require('./utils/simple-state');

/**
 * Workload module for initializing the SUT with various accounts.
 */

 // operation-base.jsを使わない版
 // 初期化処理をがっつり書きたいならこの構成がおすすめ
class TransferFrom extends WorkloadModuleInterface {

    /**
     * Initializes the parameters of the workload.
     */
    constructor() {
        super();
        this.workerIndex = -1;
        this.totalWorkers = -1;
        this.roundIndex = -1;
        this.roundArguments = undefined;
        this.sutAdapter = undefined;
        this.sutContext = undefined;
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        this.workerIndex = workerIndex;
        this.totalWorkers = totalWorkers;
        this.roundIndex = roundIndex;
        this.roundArguments = roundArguments;
        this.sutAdapter = sutAdapter;
        this.sutContext = sutContext;

        // config.yamlのパラメータ
        this.numberOfTokens = this.roundArguments.numberOfTokens;

        this.simpleState = new SimpleState(this.workerIndex, this.sutContext);

        // 試験前に事前準備が必要ならここでやる。
        // transfer用のtokenを払い出す
        let processes = []
        for(let i=0;i<this.numberOfTokens;i++){
            // mintに必要なパラメータを取得
            let mintArgs = this.simpleState.getMint1UserArguments();

            // caliper用の構成でsendTransaction
            let _createEthereumConnectorRequest = {
                contract: 'MyNFT',  // コントラクト名に合わせて変える
                verb: 'mint',
                args: Object.keys(mintArgs).map(k => mintArgs[k]),
                readOnly: false
            }
            processes.push(this.sutAdapter.sendRequests(_createEthereumConnectorRequest));
        
        }
        await Promise.all(processes)

    }

    /**
     * 測定用の関数実行
     */
    async submitTransaction() {

        let Args = this.simpleState.getBalanceOfArguments();
        let _createEthereumConnectorRequest = {
            contract: 'MyNFT',  // コントラクト名に合わせて変える
            verb: 'balanceOf',
            args: Object.keys(Args).map(k => Args[k]),
            readOnly: true
        }

        await this.sutAdapter.sendRequests(_createEthereumConnectorRequest);
    }

    async cleanupWorkloadModule() {
        // NOOP
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new TransferFrom();
}

module.exports.createWorkloadModule = createWorkloadModule;
