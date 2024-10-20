import { useEffect, useState } from "react";
import Web3 from "web3";
import TodoList from "./contracts/TodoList.json";

function App() {
  const [tasks, setTasks] = useState([]);
  const [content, setContent] = useState("");
  const [account, setAccount] = useState("");

  useEffect(() => {
    loadBlockchainData();
  }, []);

  async function loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider);
    const accounts = await web3.eth.requestAccounts();
    setAccount(accounts[0]);

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = TodoList.networks[networkId];
    const todoList = new web3.eth.Contract(TodoList.abi, deployedNetwork.address);

    const taskCount = await todoList.methods.taskCount().call();
    let tasksArray = [];
    for (let i = 1; i <= taskCount; i++) {
      const task = await todoList.methods.tasks(i).call();
      tasksArray.push(task);
    }
    setTasks(tasksArray);
  }

  async function createTask() {
    const web3 = new Web3(Web3.givenProvider);
    const networkId = await web3.eth.net.getId();
    const todoList = new web3.eth.Contract(TodoList.abi, TodoList.networks[networkId].address);

    await todoList.methods.createTask(content).send({ from: account });
    window.location.reload();
  }

  return (
    <div>
      <h1>Decentralized To-Do List</h1>
      <input 
        type="text" 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        placeholder="Add a new task" 
      />
      <button onClick={createTask}>Add Task</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.content} - {task.completed ? "✅" : "❌"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
