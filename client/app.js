App = {
    contracts: {},
    init: async () => {
      await App.loadWeb3();
      await App.loadAccount();
      await App.loadContract();
      await App.render();
      await App.renderTasks();
    },
    // loadWeb3: async () => {
    //     // Configurar el proveedor de Web3 para conectarse a la red de prueba de Polygon Mumbai
    //     const provider = new Web3.providers.HttpProvider('https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78');
    //     App.web3 = new Web3(provider);
      
    //     // Verificar si la cuenta del usuario ya está conectada
    //     if (window.ethereum) {
    //       App.web3Provider = window.ethereum;
    //       await window.ethereum.request({ method: "eth_requestAccounts" });
    //     } else if (web3) {
    //       web3 = new Web3(window.web3.currentProvider);
    //     } else {
    //       console.log(
    //         "No ethereum browser is installed. Try it installing MetaMask "
    //       );
    //     }
    //   },

    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider;
        } else {
          App.web3Provider = new Web3.providers.HttpProvider('https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78');
        }
        App.web3 = new Web3(App.web3Provider);
      },

      loadAccount: async () => {
        // Solicita acceso a la cuenta del usuario
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Obtiene la cuenta actual
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        console.log(accounts);
        App.account = accounts[0];
      },

    loadContract: async () => {
      try {
        // Actualizar la dirección y el ABI del contrato en el código
        const contractAddress = '0x388BC00919cce115Adbc1c9550e90A691cba0F52';
        const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"string","name":"title","type":"string"},{"indexed":false,"internalType":"string","name":"description","type":"string"},{"indexed":false,"internalType":"bool","name":"done","type":"bool"},{"indexed":false,"internalType":"uint256","name":"createdAt","type":"uint256"}],"name":"TaskCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"bool","name":"done","type":"bool"}],"name":"TaskToggledDone","type":"event"},{"inputs":[{"internalType":"string","name":"_title","type":"string"},{"internalType":"string","name":"_description","type":"string"}],"name":"createTask","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"taskCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tasks","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"bool","name":"done","type":"bool"},{"internalType":"uint256","name":"createdAt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"toggleDone","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  
        // Crear una instancia del contrato utilizando la dirección y el ABI
        App.contracts.TasksContract = new App.web3.eth.Contract(contractABI, contractAddress);
  
        // Verificar que la cuenta actual tenga permisos para interactuar con el contrato
        if (App.account.length === 0) {
          console.log('No hay cuenta conectada.');
        } else if (!App.contracts.TasksContract.options.address) {
          console.log('El contrato no está desplegado en la red actual.');
        } else {
          App.account 
        }
      } catch (error) {
        console.error(error);
      }
    },
    
    render: async () => {
      document.getElementById("account").innerText = App.account;
    },

    renderTasks: async () => {
      const tasksCounter = await App.contracts.TasksContract.methods.taskCounter().call();
      const taskCounterNumber = parseInt(tasksCounter);
  
      let html = "";
  
      for (let i = 1; i <= taskCounterNumber; i++) {
        const task = await App.contracts.TasksContract.methods.tasks(i).call();
        const taskId = parseInt(task[0]);
        const taskTitle = task[1];
        const taskDescription = task[2];
        const taskDone = task[3];
        const taskCreatedAt = parseInt(task[4]);
  
        // Crear una card para la tarea
        let taskElement = `<div class="card bg-dark rounded-0 mb-2">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>${taskTitle}</span>
            <div class="form-check form-switch">
              <input class="form-check-input" data-id="${taskId}" type="checkbox" onchange="App.toggleDone(this)" ${
                taskDone === true && "checked"
              }>
            </div>
          </div>
          <div class="card-body">
            <span>${taskDescription}</span>
            <span>${taskDone}</span>
            <p class="text-muted">Task was created ${new Date(
              taskCreatedAt * 1000
            ).toLocaleString()}</p>
            </label>
          </div>
        </div>`;
        html += taskElement;
      }
  
      document.querySelector("#tasksList").innerHTML = html;
    },

    createTask: async (title, description) => {
      try {
        const result = await App.contracts.TasksContract.methods.createTask(title, description).send({
          from: App.account,
        });
        console.log(result.events);
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    },

    toggleDone: async (element) => {
      const taskId = parseInt(element.dataset.id);
      await App.contracts.TasksContract.methods.toggleDone(taskId).send({
        from: App.account,
      });
      window.location.reload();
    },

  };