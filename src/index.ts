import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';

import { registerBoardTools } from './tools/boards.js';
import { registerCardTools } from './tools/cards.js';

serveStdio(() => {
  const server = new McpServer({
    name: 'trello-mcp',
    version: '1.0.0',
  });

  registerBoardTools(server);
  registerCardTools(server);

  return server;
});