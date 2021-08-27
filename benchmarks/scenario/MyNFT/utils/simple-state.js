/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';
const HDWallet = require('ethereum-hdwallet')
const Web3 = require('web3');

const Dictionary = 'abcdefghijklmnopqrstuvwxyz';

// HDウォレットのシード値
const seed = Buffer.from('efea201152e37883bdabf10b28fdac9c146f80d2e161a544a7079d2ecc4e65948a0d74e47e924f26bf35aaee72b24eb210386bcb1deda70ded202a2b7d1a8c2e', 'hex')
// HDウォレットのインスタンス化
const hdwallet= HDWallet.fromSeed(seed)
const web3 = new Web3(new Web3.providers.HttpProvider("ws://localhost:8546"));


/**
 * Class for managing simple account states.
 */
class SimpleState {

    /**
     * Initializes the instance.
     */
    constructor(workerIndex, sutContext, accounts = 0) {
        this.accountsGenerated = accounts;
        this.sutContext = sutContext
        this.accountPrefix = this._get26Num(workerIndex);

        this.transferCount = 1  //transfer用試験で使うカウンター
        this.ownerOfCount = 1   //ownerOf用試験で使うカウンター
    }

    /**
     * Generate string by picking characters from the dictionary variable.
     * @param {number} number Character to select.
     * @returns {string} string Generated string based on the input number.
     * @private
     */
    _get26Num(number){
        let result = '';

        while(number > 0) {
            result += Dictionary.charAt(number % Dictionary.length);
            number = parseInt(number / Dictionary.length);
        }

        return result;
    }

    /**
     * Construct an account key from its index.
     * @param {number} index The account index.
     * @return {string} The account key.
     * @private
     */
    _getAccountKey(index) {
        return "0x"+hdwallet.derive(`m/44'/60'/${index}'/0/0`).getAddress().toString('hex')
    }

    /**
     * Returns a random account key.
     * @return {string} Account key.
     * @private
     */
    _getRandomAccount() {
        // choose a random TX/account index based on the existing range, and restore the account name from the fragments
        const index = Math.ceil(Math.random() * this.accountsGenerated);
        this.accountsGenerated++;
        return this._getAccountKey(index);
    }

    /**
     * Get the arguments for transfering money between accounts.
     * @returns {object} The account arguments.
     */
    getTransferArguments() {
        return {
            source: this._getRandomAccount(),
            target: this._getRandomAccount(),
            amount: this.moneyToTransfer
        };
    }

    /**
     * Get the arguments for mint .
     * @returns {object} The mint arguments.
     */
    getMintArguments() {
        let _to = this._getRandomAccount()
        return {
            // 変数名をSCの引数名に合わせること
            _to: _to,
            tokenURI: ""
        };
    }

    /**
     * Get the arguments for mint .
     * @returns {object} The mint arguments.
     */
    getMint1UserArguments() {
        let _to = this.sutContext.fromAddress
        return {
            // 変数名をSCの引数名に合わせること
            _to: _to,
            tokenURI: ""
        };
    }


    /**
     * Get the arguments for mint .
     * @returns {object} The mint arguments.
     */
    getTransferArguments() {
        let index = this.transferCount
        this.transferCount++
        let from = this.sutContext.fromAddress
        return {
            // 変数名と並び順をSCの引数名に合わせること
            from: from,
            to: "0x"+hdwallet.derive(`m/44'/61'/${index}'/0/0`).getAddress().toString('hex'),
            tokenId: web3.utils.toHex(index)
        };
    }

    /**
     * Get the arguments for mint .
     * @returns {object} The mint arguments.
     */
    getBalanceOfArguments() {
        return {
            owner: this.sutContext.fromAddress,
        };
    }

    /**
     * Get the arguments for mint .
     * @returns {object} The mint arguments.
     */
    getOwnerOfArguments() {
        let index = this.ownerOfCount
        this.ownerOfCount++
        return {
            tokenId: index,
        };
    }

}

module.exports = SimpleState;
