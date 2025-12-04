# Claude Desktop MCP Server Setup

This guide shows you how to connect your HRM MCP Server to Claude Desktop.

## Prerequisites

1. Claude Desktop installed on your system
2. Node.js and npm installed
3. HRM backend dependencies installed (`npm install`)
4. Database configured and accessible

## Configuration

### Step 1: Locate Claude Desktop Config File

The Claude Desktop configuration file is located at:

- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

### Step 2: Add MCP Server Configuration

Open the `claude_desktop_config.json` file and add the HRM MCP server configuration:

```json
{
  "mcpServers": {
    "hrm-server": {
      "command": "npm",
      "args": ["run", "mcp:dev"],
      "cwd": "C:\\Users\\HarisShahid\\Downloads\\HRM-backend-1217",
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

**Important**: Update the `cwd` (current working directory) path to match your actual project location.

### Step 3: Environment Variables

Ensure your `.env` file is properly configured with:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hrm_database
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Claude API (if needed for report generation)
CLAUDE_API_KEY=your_claude_api_key

# Other required environment variables
JWT_SECRET=your_jwt_secret
```

### Step 4: Restart Claude Desktop

After saving the configuration:

1. Close Claude Desktop completely
2. Reopen Claude Desktop
3. The HRM MCP server should now be available

## Verifying the Connection

Once Claude Desktop is running:

1. Start a new conversation
2. Try asking: "What tools do you have access to?"
3. You should see tools like:
   - `get_employee_info`
   - `search_employees`
   - `get_attendance_summary`
   - And many more HRM tools

## Testing the MCP Server

You can test if the MCP server works before connecting to Claude Desktop:

```bash
# Test the stdio server directly
npm run mcp:dev
```

This will start the server. It should output to stderr:
```
HRM MCP Server running on stdio
Available tools: 17
```

Press `Ctrl+C` to stop.

## Example Usage in Claude Desktop

Once connected, you can ask Claude things like:

- "Show me all employees in the Engineering department"
- "Get attendance summary for the last 7 days"
- "List all pending leave requests"
- "Generate a headcount report by department"
- "Search for employees with 'engineer' in their title"

## Troubleshooting

### Server Not Starting

1. Check that the `cwd` path in the config is correct
2. Verify all npm dependencies are installed: `npm install`
3. Check that the database is running and accessible
4. Look for error logs in Claude Desktop's developer console

### Database Connection Errors

1. Verify database credentials in `.env`
2. Ensure the database server is running
3. Check firewall settings if database is remote

### Tools Not Showing Up

1. Restart Claude Desktop completely
2. Check the MCP server configuration syntax in `claude_desktop_config.json`
3. Verify the stdio-server.ts file exists at the correct path

## Advanced Configuration

### Using Production Build

For better performance, you can use the compiled version:

```bash
# Build the project
npm run build:mcp

# Update claude_desktop_config.json to use:
{
  "mcpServers": {
    "hrm-server": {
      "command": "node",
      "args": ["dist/modules/mcp-server/stdio-server.js"],
      "cwd": "C:\\Users\\HarisShahid\\Downloads\\HRM-backend-1217"
    }
  }
}
```

### Environment-Specific Configs

You can create multiple MCP server entries for different environments:

```json
{
  "mcpServers": {
    "hrm-dev": {
      "command": "npm",
      "args": ["run", "mcp:dev"],
      "cwd": "C:\\path\\to\\dev\\project",
      "env": {
        "NODE_ENV": "development"
      }
    },
    "hrm-prod": {
      "command": "npm",
      "args": ["run", "mcp"],
      "cwd": "C:\\path\\to\\prod\\project",
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

## Available Tools

The HRM MCP Server exposes 17 tools:

1. **Employee Management**
   - `get_employee_info` - Get detailed employee information
   - `search_employees` - Search employees by name/email
   - `get_department_employees` - List employees in a department
   - `get_departments` - List all departments

2. **Attendance & Leave**
   - `get_attendance_summary` - Get attendance statistics
   - `get_leave_requests` - List leave requests
   - `create_leave_request` - Create new leave request

3. **Recruitment**
   - `get_job_openings` - List job openings
   - `get_candidates` - List candidates

4. **Performance**
   - `get_performance_reviews` - Get performance reviews
   - `get_employee_goals` - Get employee goals

5. **Insights & Reports**
   - `get_hyper_insights` - Get AI-powered HR insights
   - `generate_dynamic_report` - Generate custom reports
   - `generate_quick_report` - Generate predefined reports

6. **Database Access**
   - `get_database_schema` - Get database schema
   - `execute_sql_query` - Execute SQL queries
   - `get_table_info` - Get table information

## Security Notes

- The MCP server runs locally and uses your database credentials
- Ensure your `.env` file is not committed to version control
- The stdio transport is secure as it only communicates locally
- Database queries are validated and limited for safety

## Support

For issues or questions:
- Check the logs in Claude Desktop developer console
- Review the server logs (stderr output)
- Ensure all dependencies are up to date
