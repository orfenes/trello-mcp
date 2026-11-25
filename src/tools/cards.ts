import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4"; 
import { trelloRequest } from "../trello.js";

interface Card{
  id: string,
  name: string,
  description: string
  idList: string,
  url: string,
}

interface List {
  id: string,
  name: string,
}

export function registerCardTools(server: McpServer) {
  server.registerTool(
    'list_cards', {
      description: 'Lista os cards de um quadro do Trello.',
      inputSchema: z.object({
        boardId: z.string().min(1)
      })
    },
    async({boardId}) => {
      const cards = await trelloRequest<Card[]>(
        `/boards/${encodeURIComponent(boardId)}/cards`, 
        { fields: 'id,name,desc,idList,url' } 
      );
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(cards, null, 2)
        }]
      }
    }
  );

  server.registerTool(
    'create_card',
    {
      description: 'Cria um cartão em uma lista do Trello.',
      inputSchema: z.object({
        listId: z.string().min(1),
        name: z.string().min(1),
        description: z.string().optional()
      })
    },
    async ({ listId, name, description }) => {
      const card = await trelloRequest<Card>(
        '/cards',
        {
          idList: listId,
          name,
          desc: description ?? ''
        },
        'POST'
      );

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(card, null, 2)
        }]
      };
    }
  );

  server.registerTool(
    'list_list',
    {
      description: 'Lista as listas de um quadro do Trello.',
      inputSchema: z.object({
        boardId: z.string().min(1)
      })
    },
    async({boardId}) => {
     const lists = await trelloRequest<List[]>(
      `/boards/${encodeURIComponent(boardId)}/lists`,
      { fields: 'id,name' }
     );

     return {
      content: [{
        type: 'text',
        text: JSON.stringify(lists, null, 2)
      }]
     }
    }
  );
};