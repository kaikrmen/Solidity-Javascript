//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract TasksContract {
    uint public taskCounter = 0;

    constructor() {
        initialize();
    }

    struct Task {
        uint256 id;
        string description;
        string title;
        bool done;
        uint256 createdAt;
    }

    mapping(uint256 => Task) public tasks;

    function createTask(string memory _title, string memory _description) public {
        tasks[taskCounter] = Task(taskCounter, _description, _title, false, block.timestamp);
        taskCounter++;
    }

    function toggleDone(uint _id) public {
        Task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;
    }

    function initialize() public {
        createTask("My First Task", "My First Description");
    }
}