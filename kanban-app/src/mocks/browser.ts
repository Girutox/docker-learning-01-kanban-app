import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'
import { environment } from '../environments/environment'
import { Board, Task } from '../app/model/board.model';

let dummyBoards: Board[] = [
  {
    "id": 1,
    "name": "Marketing Plan",
    "columns": [
      {
        "id": 1,
        "name": "Todo",
        "color": "#ff5733",
        "tasks": [
          {
            "id": 1,
            "title": "Plan Product Hunt launch",
            "description": "We're planning to launch on Product Hunt in 2 weeks. We need to get everything ready for the launch, including the product page, assets, and network notifications.",
            "status": "Todo",
            "columnId": 1,
            "subtasks": [
              {
                "id": 1,
                "title": "Find hunter",
                "isCompleted": false
              },
              {
                "id": 2,
                "title": "Gather assets",
                "isCompleted": false
              },
              {
                "id": 3,
                "title": "Draft product page",
                "isCompleted": false
              },
              {
                "id": 4,
                "title": "Notify customers",
                "isCompleted": false
              },
              {
                "id": 5,
                "title": "Notify network",
                "isCompleted": false
              },
              {
                "id": 6,
                "title": "Launch!",
                "isCompleted": false
              }
            ]
          },
          {
            "id": 2,
            "title": "Share on Show HN",
            "description": "We're planning to share our product on Show HN to get feedback from the community. We need to draft out the post, get feedback, and publish the post.",
            "status": "Todo",
            "columnId": 1,
            "subtasks": [
              {
                "id": 7,
                "title": "Draft out HN post",
                "isCompleted": false
              },
              {
                "id": 8,
                "title": "Get feedback and refine",
                "isCompleted": false
              },
              {
                "id": 9,
                "title": "Publish post",
                "isCompleted": false
              }
            ]
          },
          {
            "id": 3,
            "title": "Write launch article to publish on multiple channels",
            "description": "We're planning to write an article about our launch and publish it on multiple channels to get the word out. We need to draft the article and publish it on LinkedIn, Indie Hackers, and Medium.",
            "status": "Todo",
            "columnId": 1,
            "subtasks": [
              {
                "id": 10,
                "title": "Write article",
                "isCompleted": false
              },
              {
                "id": 11,
                "title": "Publish on LinkedIn",
                "isCompleted": false
              },
              {
                "id": 12,
                "title": "Publish on Inndie Hackers",
                "isCompleted": false
              },
              {
                "id": 13,
                "title": "Publish on Medium",
                "isCompleted": false
              }
            ]
          }
        ]
      },
      {
        "id": 2,
        "name": "Doing",
        "color": "#d5e723",
        "tasks": []
      },
      {
        "id": 3,
        "name": "Done",
        "color": "#2367e7",
        "tasks": []
      }
    ]
  },
  {
    "id": 2,
    "name": "Roadmap",
    "columns": [
      {
        "id": 4,
        "name": "Now",
        "color": "#e72382",
        "tasks": [
          {
            "id": 4,
            "title": "Launch version one",
            "description": "We're planning to launch version one of our product in 2 weeks. We need to get everything ready for the launch, including the product page, assets, and network notifications.",
            "status": "Now",
            "columnId": 4,
            "subtasks": [
              {
                "id": 14,
                "title": "Launch privately to our waitlist",
                "isCompleted": false
              },
              {
                "id": 15,
                "title": "Launch publicly on PH, HN, etc.",
                "isCompleted": false
              }
            ]
          },
          {
            "id": 5,
            "title": "Review early feedback and plan next steps for roadmap",
            "description": "Beyond the initial launch, we're keeping the initial roadmap completely empty. This meeting will help us plan out our next steps based on actual customer feedback.",
            "status": "Now",
            "columnId": 4,
            "subtasks": [
              {
                "id": 16,
                "title": "Interview 10 customers",
                "isCompleted": true
              },
              {
                "id": 17,
                "title": "Review common customer pain points and suggestions",
                "isCompleted": false
              },
              {
                "id": 18,
                "title": "Outline next steps for our roadmap",
                "isCompleted": false
              }
            ]
          }
        ]
      },
      {
        "id": 5,
        "name": "Next",
        "color": "#23e7e1",
        "tasks": []
      },
      {
        "id": 6,
        "name": "Later",
        "color": "#23e729",
        "tasks": []
      }
    ]
  }
];

export const mocks = [
  http.get(`${environment.apiBaseUrl}/boards`, () => {
    return HttpResponse.json(dummyBoards);
  }),
  http.post(`${environment.apiBaseUrl}/boards/save`, async ({ request }) => {
    const payload = await request.json() as Board;
    if (payload.id) {
      // Update existing board
      dummyBoards = dummyBoards.map(board => board.id === payload.id ? payload : board);
    } else {
      // Create new board
      payload.id = dummyBoards.length + 1;
      dummyBoards = [...dummyBoards, payload];
    }

    return HttpResponse.json(dummyBoards);
  }),
  http.post(`${environment.apiBaseUrl}/tasks/save`, async ({ request }) => {
    const payload = await request.json() as Task;

    dummyBoards = dummyBoards.map(board => {
      const column = board.columns.find(col => col.id === payload.columnId);
      if (column) {
        const taskIndex = column.tasks.findIndex(t => t.id === payload.id);
        if (taskIndex > -1) {
          // Update existing task
          column.tasks[taskIndex] = payload;
        } else {
          // Add new task
          payload.id = column.tasks.length + 1;
          column.tasks.push(payload);
        }
      }
      return board;
    });

    return HttpResponse.json(payload);
  }),
  http.delete<{ id: string }>(`${environment.apiBaseUrl}/boards/delete/:id`, async ({ request, params }) => {
    const { id } = params;
    dummyBoards = dummyBoards.filter(board => board.id !== Number(id));

    return HttpResponse.json(dummyBoards);
  })
]

export const worker = setupWorker(...mocks)