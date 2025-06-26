const { expect } = require("chai");

// Placeholder Lottery contract interface
const Lottery = artifacts.require("Lottery");

describe("Lottery", function () {
  let lottery;
  let accounts;

  beforeEach(async function () {
    accounts = await web3.eth.getAccounts();
    // Assume Lottery is already deployed
    lottery = await Lottery.deployed();
  });

  it("should not allow buying more than the max tickets", async function () {
    const maxTickets = await lottery.maxTickets();
    try {
      for (let i = 0; i <= maxTickets.toNumber(); i++) {
        await lottery.buyTicket({ from: accounts[0], value: web3.utils.toWei("1", "ether") });
      }
      expect.fail("Expected error not received");
    } catch (err) {
      expect(err.message).to.contain("Max tickets reached");
    }
  });

  it("distributes fees correctly", async function () {
    const feePercent = await lottery.feePercent();
    const potBefore = await lottery.pot();
    await lottery.buyTicket({ from: accounts[1], value: web3.utils.toWei("1", "ether") });
    const potAfter = await lottery.pot();
    const expectedPot = potBefore.add(web3.utils.toBN(web3.utils.toWei("1", "ether")).mul(web3.utils.toBN(100 - feePercent)).div(web3.utils.toBN(100)));
    expect(potAfter.toString()).to.equal(expectedPot.toString());
  });

  it("pays the winner", async function () {
    await lottery.buyTicket({ from: accounts[2], value: web3.utils.toWei("1", "ether") });
    await lottery.pickWinner({ from: accounts[0] });
    const winner = await lottery.lastWinner();
    expect(winner).to.not.equal("0x0000000000000000000000000000000000000000");
  });
});
