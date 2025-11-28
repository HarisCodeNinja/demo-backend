# Streaming Chat with Automatic Tool Execution

The `/mcp/chat/stream` endpoint now **fully supports automatic tool execution** while streaming responses in real-time.

## How It Works

When you send a request to the streaming endpoint, Claude will:
1. **Stream initial analysis** → Real-time text as Claude thinks
2. **Detect tool need** → Automatically identifies when tools are needed
3. **Execute tools** → Runs tools server-side automatically
4. **Stream results** → Continues streaming Claude's response with the data
5. **Repeat if needed** → Handles multi-turn tool execution

---

## Complete Event Types

Your client will receive these Server-Sent Events (SSE):

### 1. `text` - Streaming Text Content
```json
{
  "type": "text",
  "content": "I'll help you find candidates who cleared interviews."
}
```
**When**: Claude is generating text responses
**Action**: Display this text to the user in real-time

---

### 2. `tool_start` - Tool Usage Beginning
```json
{
  "type": "tool_start",
  "name": "get_candidates"
}
```
**When**: Claude decides to use a tool
**Action**: Show loading indicator or "Fetching candidates..." message

---

### 3. `tool_executing` - Tools Being Executed
```json
{
  "type": "tool_executing",
  "count": 2
}
```
**When**: Server is executing one or more tools
**Action**: Show "Analyzing data..." or progress indicator

---

### 4. `tool_complete` - Single Tool Completed
```json
{
  "type": "tool_complete",
  "name": "get_candidates"
}
```
**When**: A specific tool finishes execution
**Action**: Update progress indicator

---

### 5. `tool_error` - Tool Execution Failed
```json
{
  "type": "tool_error",
  "name": "get_candidates",
  "error": "Database connection timeout"
}
```
**When**: A tool fails to execute
**Action**: Show error message, Claude will continue with partial data

---

### 6. `tool_results_sent` - Results Sent Back to Claude
```json
{
  "type": "tool_results_sent"
}
```
**When**: Tool results are being sent back to Claude for analysis
**Action**: Show "Analyzing results..." message

---

### 7. `done` - Stream Completed
```json
{
  "type": "done",
  "iterations": 2
}
```
**When**: Entire conversation is complete
**Action**: Close EventSource, hide loading indicators

---

## Example Flow

### Request:
```bash
POST /mcp/chat/stream
Content-Type: application/json

{
  "messages": [
    {
      "role": "user",
      "content": "give me list of candidates who have cleared the interview this year"
    }
  ]
}
```

### Response Stream:
```
data: {"type":"text","content":"I'll help you"}
data: {"type":"text","content":" find candidates"}
data: {"type":"text","content":" who cleared interviews."}

data: {"type":"tool_start","name":"get_candidates"}
data: {"type":"tool_executing","count":1}
data: {"type":"tool_complete","name":"get_candidates"}
data: {"type":"tool_results_sent"}

data: {"type":"text","content":"Based on the data,"}
data: {"type":"text","content":" here are the 15 candidates"}
data: {"type":"text","content":" who cleared interviews in 2024:\n\n"}
data: {"type":"text","content":"1. John Doe - Software Engineer\n"}
data: {"type":"text","content":"2. Jane Smith - Product Manager\n"}
data: {"type":"text","content":"..."}

data: {"type":"done","iterations":1}
```

---

## Frontend Implementation

### Basic Implementation (Vanilla JS)

```javascript
async function chatWithStreaming(message) {
  const response = await fetch('http://localhost:3000/mcp/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        { role: 'user', content: message }
      ]
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        handleStreamEvent(data);
      }
    }
  }
}

function handleStreamEvent(event) {
  switch (event.type) {
    case 'text':
      appendText(event.content);
      break;

    case 'tool_start':
      showToolIndicator(event.name);
      break;

    case 'tool_executing':
      showLoadingSpinner();
      break;

    case 'tool_complete':
      hideLoadingSpinner();
      break;

    case 'tool_error':
      showError(event.error);
      break;

    case 'done':
      onComplete();
      break;
  }
}
```

---

### React Implementation

```jsx
import { useState, useEffect } from 'react';

function ChatWithStreaming() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toolStatus, setToolStatus] = useState(null);

  async function sendMessage(userMessage) {
    setIsLoading(true);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    const response = await fetch('http://localhost:3000/mcp/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let assistantMessage = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const event = JSON.parse(line.slice(6));

          switch (event.type) {
            case 'text':
              assistantMessage += event.content;
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];

                if (lastMessage?.role === 'assistant') {
                  lastMessage.content = assistantMessage;
                } else {
                  newMessages.push({ role: 'assistant', content: assistantMessage });
                }

                return newMessages;
              });
              break;

            case 'tool_start':
              setToolStatus({ type: 'start', name: event.name });
              break;

            case 'tool_executing':
              setToolStatus({ type: 'executing', count: event.count });
              break;

            case 'tool_complete':
              setToolStatus({ type: 'complete', name: event.name });
              break;

            case 'done':
              setIsLoading(false);
              setToolStatus(null);
              break;
          }
        }
      }
    }
  }

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i} className={msg.role}>
          {msg.content}
        </div>
      ))}

      {toolStatus && (
        <div className="tool-indicator">
          {toolStatus.type === 'start' && `Using tool: ${toolStatus.name}`}
          {toolStatus.type === 'executing' && 'Executing tools...'}
          {toolStatus.type === 'complete' && `✓ ${toolStatus.name} complete`}
        </div>
      )}

      {isLoading && <div className="loading">Thinking...</div>}
    </div>
  );
}
```

---

## Features

✅ **Real-time Streaming** - See Claude's response as it's generated
✅ **Automatic Tool Execution** - Tools are called automatically
✅ **Multi-Turn Support** - Handles multiple tool calls in sequence
✅ **Progress Indicators** - Know exactly what's happening
✅ **Error Handling** - Graceful handling of tool failures
✅ **Complete Responses** - Always get final results with data

---

## Comparison: Streaming vs Non-Streaming

| Feature | `/chat/stream` | `/chat/conversational` |
|---------|----------------|------------------------|
| Real-time text | ✅ Yes | ❌ No (waits for complete) |
| Tool execution | ✅ Automatic | ✅ Automatic |
| Progress events | ✅ Detailed | ❌ Single response |
| Best for | Live chat UI | Simple requests |
| Response format | Server-Sent Events | JSON |

---

## Testing

### Test with curl:
```bash
curl -N -X POST http://localhost:3000/mcp/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Show me employees with more than 2 absences this month"
      }
    ]
  }'
```

The `-N` flag disables buffering so you see events in real-time.

---

## Expected Behavior

### Before (Old Implementation):
```
→ Stream text
→ Announce tool use
→ END (no results!)
```

### After (New Implementation):
```
→ Stream initial thinking
→ Announce tool use
→ Execute tool
→ Stream results analysis
→ Complete with full answer
```

---

## Multi-Turn Example

If Claude needs multiple tools:

```
User: "Compare department sizes and identify understaffed ones"

Stream:
1. text: "I'll analyze departments..."
2. tool_start: "get_departments"
3. tool_complete: "get_departments"
4. tool_start: "search_employees" (for each dept)
5. tool_complete: "search_employees"
6. tool_results_sent
7. text: "Based on the analysis..."
8. text: "Engineering has 15 people (avg: 25)..."
9. done
```

---

## Error Handling

If a tool fails, Claude continues with available data:

```
Stream:
1. text: "Let me get the data..."
2. tool_start: "get_candidates"
3. tool_error: "Database connection timeout"
4. text: "I encountered an error accessing the database..."
5. done
```

---

## Performance Notes

- **Max iterations**: 10 tool execution rounds
- **Timeout**: Standard HTTP timeout applies
- **Concurrency**: Multiple tools execute in parallel
- **Streaming**: No buffering, real-time events

---

## Debug Mode

Check server logs to see tool execution:
```
[Claude Streaming] Executing tool: get_candidates {"status":"cleared"}
[Claude Streaming] Tool execution error for get_candidates: Connection timeout
```

---

## Summary

The streaming endpoint now provides:
1. 🚀 **Real-time responses** - See Claude thinking
2. 🔧 **Automatic tools** - No manual intervention needed
3. 📊 **Progress tracking** - Know what's happening
4. ✅ **Complete results** - Full data with analysis
5. 🔁 **Multi-turn** - Complex queries supported

It's now **fully equivalent** to the non-streaming endpoint in functionality, but with real-time user experience!
