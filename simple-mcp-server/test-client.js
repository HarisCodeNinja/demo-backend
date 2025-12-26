/**
 * Test Client for Simple MCP Server
 *
 * Tests the RPC endpoints with real HRM tools
 */

const fetch = require('node-fetch');

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';
const CLIENT_ID = 'simple-mcp-client';
const CLIENT_SECRET = 'simple-mcp-secret-123';

let accessToken = null;
let requestId = 0;

// ============================================
// HELPER FUNCTIONS
// ============================================

async function getToken() {
  console.log('\n📋 Step 1: Getting OAuth Token...');
  console.log('='.repeat(50));

  const response = await fetch(`${SERVER_URL}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  const data = await response.json();

  if (response.ok) {
    accessToken = data.access_token;
    console.log('✅ Token obtained successfully');
    console.log(`   Token: ${accessToken.substring(0, 20)}...`);
    console.log(`   Expires in: ${data.expires_in} seconds`);
  } else {
    console.error('❌ Token request failed:', data);
    throw new Error('Failed to get token');
  }
}

async function rpcCall(method, params = {}) {
  const id = ++requestId;

  const response = await fetch(`${SERVER_URL}/rpc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id,
      method,
      params,
    }),
  });

  const data = await response.json();

  if (data.error) {
    console.error(`❌ RPC Error:`, data.error);
    throw new Error(data.error.message);
  }

  return data.result;
}

// ============================================
// TEST FUNCTIONS
// ============================================

async function testInitialize() {
  console.log('\n📋 Step 2: Initialize Connection...');
  console.log('='.repeat(50));

  const result = await rpcCall('initialize');
  console.log('✅ Initialize succeeded');
  console.log('   Server:', result.serverInfo.name);
  console.log('   Version:', result.serverInfo.version);
  console.log('   Protocol:', result.protocolVersion);
}

async function testListTools() {
  console.log('\n📋 Step 3: List Available Tools...');
  console.log('='.repeat(50));

  const result = await rpcCall('tools/list');
  console.log(`✅ Found ${result.tools.length} tools:`);

  result.tools.forEach((tool, index) => {
    console.log(`\n   ${index + 1}. ${tool.name}`);
    console.log(`      ${tool.description}`);
  });
}

async function testSearchEmployees() {
  console.log('\n📋 Step 4: Test Tool - search_employees (all)...');
  console.log('='.repeat(50));

  const result = await rpcCall('tools/call', {
    name: 'search_employees',
    arguments: {
      limit: 10,
    },
  });

  const data = JSON.parse(result.content[0].text);
  console.log('✅ Tool executed successfully');
  console.log(`   Found: ${data.data.employees.length} employees`);
  console.log(`   Message: ${data.meta.message}`);

  if (data.data.employees.length > 0) {
    console.log('\n   Sample employee:');
    const emp = data.data.employees[0];
    console.log(`   - ${emp.firstName} ${emp.lastName}`);
    console.log(`   - Email: ${emp.email}`);
    console.log(`   - Department: ${emp.departmentName}`);
    console.log(`   - Designation: ${emp.designationName}`);
  }
}

async function testSearchEmployeesByName() {
  console.log('\n📋 Step 5: Test Tool - search_employees (by name)...');
  console.log('='.repeat(50));

  const result = await rpcCall('tools/call', {
    name: 'search_employees',
    arguments: {
      query: 'John',
      limit: 5,
    },
  });

  const data = JSON.parse(result.content[0].text);
  console.log('✅ Tool executed successfully');
  console.log(`   Found: ${data.data.employees.length} employees matching "John"`);
  console.log(`   Message: ${data.meta.message}`);
}

async function testSearchEmployeesByDepartment() {
  console.log('\n📋 Step 6: Test Tool - search_employees (by department)...');
  console.log('='.repeat(50));

  const result = await rpcCall('tools/call', {
    name: 'search_employees',
    arguments: {
      filters: {
        departmentId: '650e8400-e29b-41d4-a716-446655440001', // Engineering
      },
      limit: 10,
    },
  });

  const data = JSON.parse(result.content[0].text);
  console.log('✅ Tool executed successfully');
  console.log(`   Found: ${data.data.employees.length} employees in Engineering`);
  console.log(`   Message: ${data.meta.message}`);
}

async function testGetDepartments() {
  console.log('\n📋 Step 7: Test Tool - get_departments...');
  console.log('='.repeat(50));

  const result = await rpcCall('tools/call', {
    name: 'get_departments',
    arguments: {
      includeEmployeeCount: true,
    },
  });

  const data = JSON.parse(result.content[0].text);
  console.log('✅ Tool executed successfully');
  console.log(`   Found: ${data.data.departments.length} departments`);
  console.log(`   Message: ${data.meta.message}`);

  console.log('\n   Departments:');
  data.data.departments.forEach((dept, index) => {
    console.log(`   ${index + 1}. ${dept.departmentName} (${dept.employeeCount} employees)`);
  });
}

// ============================================
// RUN ALL TESTS
// ============================================

async function runAllTests() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║    Simple MCP Server - Test Client (HRM Tools)  ║');
  console.log('╚═══════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🌐 Server: ${SERVER_URL}`);

  try {
    await getToken();
    await testInitialize();
    await testListTools();
    await testSearchEmployees();
    await testSearchEmployeesByName();
    await testSearchEmployeesByDepartment();
    await testGetDepartments();

    console.log('\n');
    console.log('✅ All tests passed!');
    console.log('');
    console.log('💡 Try asking Claude:');
    console.log('   "Show me all employees in Engineering"');
    console.log('   "Search for employees named John"');
    console.log('   "List all departments with employee counts"');
    console.log('');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests
runAllTests();
