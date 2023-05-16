const TasksContract = artifacts.require("TasksContract");

contract("TasksContract", () => {

  let tasksContract;

  before(async () => {
    tasksContract = await TasksContract.deployed();
  });

  it("Migrate deployed successfully", async () => {
    const address = tasksContract.address;
    assert.notEqual(address, "0x0000000000000000000000000000000000000000");
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });


  it("Get tasks list", async () => {
    const taskCounter = await tasksContract.taskCounter();
    const task = await tasksContract.tasks(taskCounter.toNumber());
    assert.equal(task.id.toNumber(), taskCounter.toNumber());
    assert.equal(task.title, 'My First Task');
    assert.equal(task.description, "My First Description");
    assert.equal(task.done, false);
    assert.equal(taskCounter.toNumber(), 1);
  })

  it("Task created successfully", async () => { 
    const result = await tasksContract.createTask("My Second Task", "My Second Description");
    const taskEvent = result.logs[0].args;
    const taskCounter = await tasksContract.taskCounter();
    assert.equal(taskEvent.id.toNumber(), 2);
    assert.equal(taskEvent.title, "My Second Task");
    assert.equal(taskEvent.description, "My Second Description");
    assert.equal(taskEvent.done, false);
    assert.equal(taskCounter.toNumber(), 2);

  })

  it("Task toggled successfully", async () => { 
    const result = await tasksContract.toggleDone(1);
    const taskEvent = result.logs[0].args;
    assert.equal(taskEvent.done, true);
    assert.equal(taskEvent.id.toNumber(), 1);
  })

});