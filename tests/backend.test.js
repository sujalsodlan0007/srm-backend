const test = require('node:test');
const assert = require('node:assert/strict');

const { app } = require('../dist/server');
const { connectDatabase } = require('../dist/config/db');

let server;

test.before(async () => {
  await connectDatabase();
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
});

test.after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('POST /api/leads creates a lead and returns a reference ID', async () => {
  const port = server.address().port;
  const response = await fetch(`http://127.0.0.1:${port}/api/leads`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      name: 'Asha Rao',
      company: 'Northwind Apparel',
      country: 'India',
      email: 'asha@example.com',
      phone: '+919259010657',
      productInterest: 'Private Label',
      quantityRequired: '1000 units',
      message: 'We need a premium quote for a new collection.',
      source: 'contact-form'
    })
  });

  assert.equal(response.status, 201);
  const body = await response.json();
  assert.equal(body.success, true);
  assert.ok(body.leadId);
});

test('POST /api/leads preserves request quotation metadata and exposes it to admin leads', async () => {
  const port = server.address().port;

  const createResponse = await fetch(`http://127.0.0.1:${port}/api/leads`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      name: 'Jane Doe',
      company: 'Northwind Apparel',
      country: 'India',
      email: 'jane@example.com',
      phone: '+919568978819',
      productInterest: 'Private Label',
      quantityRequired: '1200 units',
      message: 'Need a custom quote for a new range.',
      firstName: 'Jane',
      lastName: 'Doe',
      fullName: 'Jane Doe',
      productType: 'Hoodies',
      quantity: '1200 units',
      estimatedBudget: '$5,000 - $10,000',
      additionalDetails: 'Need better fabric quality.'
    })
  });

  assert.equal(createResponse.status, 201);
  const createdBody = await createResponse.json();
  assert.equal(createdBody.success, true);
  assert.ok(createdBody.leadId);

  const loginResponse = await fetch(`http://127.0.0.1:${port}/api/admin/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: 'sujalsodlan0001@gmail.com',
      password: 'sachin@2001'
    })
  });

  assert.equal(loginResponse.status, 200);
  const loginBody = await loginResponse.json();
  assert.equal(loginBody.success, true);
  assert.ok(loginBody.token);

  const leadsResponse = await fetch(`http://127.0.0.1:${port}/api/admin/leads`, {
    headers: { Authorization: `Bearer ${loginBody.token}` }
  });

  assert.equal(leadsResponse.status, 200);
  const leadsBody = await leadsResponse.json();
  assert.equal(leadsBody.success, true);

  const lead = leadsBody.leads.find((item) => item.email === 'jane@example.com');
  assert.ok(lead);
  assert.equal(lead.fullName, 'Jane Doe');
  assert.equal(lead.productType, 'Hoodies');
  assert.equal(lead.estimatedBudget, '$5,000 - $10,000');
  assert.equal(lead.status, 'new');
});

test('POST /api/admin/login authenticates the seeded admin user', async () => {
  const port = server.address().port;
  const response = await fetch(`http://127.0.0.1:${port}/api/admin/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
        email: 'sujalsodlan0001@gmail.com',
        password: 'sachin@2001'
    })
  });

  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.success, true);
  assert.ok(body.token);
});
