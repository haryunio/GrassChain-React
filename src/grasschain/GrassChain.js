import React from 'react';
import Web3 from 'web3';

class GrassChain extends React.Component{
    componentWillMount() {
        const ABI = [{"constant":true,"inputs":[],"name":"GSCCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"GSCID","type":"uint256"}],"name":"getGSCHistory","outputs":[{"name":"history","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"GSCList","outputs":[{"name":"mainWallet","type":"address"},{"name":"value","type":"uint256"},{"name":"deposit","type":"uint256"},{"name":"Gchain_all","type":"uint256"},{"name":"status","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"GSCID","type":"uint256"}],"name":"verify","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"GSCID","type":"uint256"}],"name":"getGSCRatio","outputs":[{"name":"ratio","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"GSCID","type":"uint256"}],"name":"pay","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"GSCID","type":"uint256"}],"name":"getGSCAddr","outputs":[{"name":"Gchain","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"Gchain","type":"address[]"},{"name":"value","type":"uint256"},{"name":"ratio","type":"uint256[]"}],"name":"createGSC","outputs":[{"name":"GSCID","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"GSCID","type":"uint256"}],"name":"abort","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"GSCID","type":"uint256"}],"name":"getGSCTimestamp","outputs":[{"name":"timestamp","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[],"name":"aborted","type":"event"},{"anonymous":false,"inputs":[],"name":"purchaseConfirmed","type":"event"},{"anonymous":false,"inputs":[],"name":"paymentDone","type":"event"}];
        const contractAddr = "0xE8720CB8b80ffb4D93BeE736C624dc547603fc49";

        let web3 = new Web3(Web3.givenProvider);
        let GrassChain = new web3.eth.Contract(ABI, contractAddr);

        var GSCID = 2;

        GrassChain.methods.GSCCount().call().then((result) => {
            console.log(result);
        });

        //getAddress and create purchase GSC
        Promise.all([getAddress(), getGSCData(GSCID)]).then(function (address, GSCData) {
            console.log("User Address : " + address[0]);
            console.log("GSC Data : " + GSCData);

            GrassChain.methods.pay(GSCID).send(
                {
                    from:address[0].toString(),
                    to:contractAddr,
                    value:web3.utils.toWei('0.01', 'ether')
                }).then(function (result) {
                    console.log("Sent done!");
                    console.log(result);
                }, function (reason) {
                    console.log("Error!");
                    console.log(reason);
            });
        });

        async function getAddress() {
            let Adr = await web3.eth.getAccounts();
            return Adr[0];
        }
        async function getGSCData(GSCID) {
            let [GSCList, GSCRatio, GSCTimeStamp, GSCAddr] = await Promise.all(
                [
                    GrassChain.methods.GSCList(GSCID).call(),
                    GrassChain.methods.getGSCRatio(GSCID).call(),
                    GrassChain.methods.getGSCTimestamp(GSCID).call(),
                    GrassChain.methods.getGSCAddr(GSCID).call()
                ]);
            console.log(GSCList);
            console.log(GSCRatio);
            console.log(GSCTimeStamp);
            console.log(GSCAddr);
            return 0;
        }
        function numberComma(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
    render(){
        return(
            <div>
                <h1>GrassChain Component Works!</h1>
                <h2>GrassChain Address : </h2>
            </div>
        );
    }
}

export default GrassChain;