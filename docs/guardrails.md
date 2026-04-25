# Agentic Guardrails

## Security
- **No Hardcoded Secrets**: Use environment variables for all API keys, database credentials, and secrets.
- **Input Validation**: All external inputs must be sanitized and validated before use.
- **Least Privilege**: Agents should only request or use tools and permissions necessary for the current task.

## Error Handling
- **Graceful Degradation**: Systems should fail safely.
- **Logging**: All errors must be logged with context (stack trace, input parameters, timestamp).
- **No Silenced Errors**: Do not use empty catch blocks.

## Resource Management
- **Efficiency**: Avoid redundant API calls or expensive operations.
- **Cleanup**: Ensure file handles, database connections, and network sockets are closed after use.

## Workflow Integrity
- **Mandatory Peer Review**: All code must be reviewed by the Senior Lead agent before submission.
- **Sanity Checks**: Every change must trigger a sanity check test.
- **Zero-Failure Policy**: No code with failing tests should ever be proposed for review.
