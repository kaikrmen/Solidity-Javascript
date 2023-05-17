App = {
    contracts: {},
    init: () => {
        console.log('App initialized');
        App.loadEthereum();
        App.loadContracts();
    },

    loadEthereum: async () => { 
        if (window.ethereum) {
            console.log('Ethereum enabled')
            App.web3Provider = window.ethereum;
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } else if (window.web3) {
            web3 = new Web3(window.web3.currentProvider);
        } else { 
            console.log('No Ethereum browser detected');
        }
    },

    loadContracts: async () => {
        const res = await fetch('TasksContract.json');
        const taskContractJSON = await res.json();
        console.log(taskContractJSON);
        App.contracts.tasksContract = TruffleContract(taskContractJSON);
        App.contracts.tasksContract.setProvider(App.web3Provider);
        App.tasksContract = await App.contracts.tasksContract.deployed();
    }
}


App.init();