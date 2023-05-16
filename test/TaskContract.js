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
    const task = await tasksContract.tasks(taskCounter.toNumber() - 1);
    console.log(task);
    assert.equal(task.id.toNumber(), taskCounter.toNumber() - 1);
    assert.equal(task.title, 'My First Task');
    assert.equal(task.description, "My First Description");
    assert.equal(task.done, false);
    assert.equal(taskCounter.toNumber(), 1);
  })


});