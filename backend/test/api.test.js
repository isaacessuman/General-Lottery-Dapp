const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

// Placeholder for express app
const app = require('../app');
// Placeholder for database instance
const db = require('../db');

describe('API', function () {
  before(async function () {
    // Initialize database connection
    await db.connect();
  });

  after(async function () {
    await db.disconnect();
  });

  it('responds to GET /tickets', async function () {
    const res = await chai.request(app).get('/tickets');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  it('inserts a ticket into the database', async function () {
    const ticket = { player: '0x0', numbers: [1,2,3] };
    const result = await db.insertTicket(ticket);
    expect(result.insertedId).to.exist;
  });
});
