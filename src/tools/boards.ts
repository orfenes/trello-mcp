import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4"; 
import { trelloRequest } from "../trello.js";

interface Board {
  id: string,
  name: string,
  url: string,
}

export function registerBoardTools(server: McpServer) {
  server.registerTool(
    'listBoards',
    {
      description: 'Lista todos os quadros do Trello.',
      inputSchema: z.object({}),
    },
      async() => {
        const boards = await trelloRequest<Board[]>(
          '/members/me/boards', 
          { fields: 'id,name,url' }
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(boards, null, 2)
            }
          ]        
      };
    }
  );
};