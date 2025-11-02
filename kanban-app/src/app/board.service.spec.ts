import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BoardService } from './board.service';
import { Board, Column, Subtask } from './model/board.model';
import { HttpClientModule } from '@angular/common/http';
import { worker } from '../mocks/browser';
import { signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';

describe('BoardService', () => {
  let service: BoardService;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  let fireBaseBoardUID = '1';

  function awaitPromise(promise: Promise<object>) {
    return promise.then(res => {
      const response: Record<string, Board[]> = res as Record<string, Board[]>;
      if (response) {
        fireBaseBoardUID = Object.keys(response)[0];
        const boards = response[fireBaseBoardUID];
        boards.map((board) => {
          if (!board.hasOwnProperty('columns')) {
            board.columns = [];
          } else {
            board.columns.map((column) => {
              if (!column.hasOwnProperty('tasks')) {
                column.tasks = [];
              } else {
                column.tasks.map((task) => {
                  if (!task.hasOwnProperty('subtasks')) {
                    task.subtasks = [];
                  }
                });
              }
            });
          }
        });
        service.boards.set(boards);
      } else {
        service.boards.set([]);
      }
    });
  }

  beforeAll(async () => {
    await worker.start({
      onUnhandledRequest: 'bypass'
    });
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        BoardService,
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.inject(BoardService);
    service.fireBaseBoardUID = fireBaseBoardUID;
    service.boards = signal<Board[]>([
      {
        "id": 1,
        "name": "Platform Launch",
        "columns": []
      },
      {
        "id": 2,
        "name": "Marketing Plan",
        "columns": [
          {
            "name": "Todo",
            "color": "#ff5733",
            "tasks": [
              {
                "id": 1,
                "title": "Plan Product Hunt launch",
                "description": "We're planning to launch on Product Hunt in 2 weeks. We need to get everything ready for the launch, including the product page, assets, and network notifications.",
                "status": "Todo",
                "subtasks": [
                  {
                    "title": "Find hunter",
                    "isCompleted": false
                  },
                  {
                    "title": "Gather assets",
                    "isCompleted": false
                  },
                  {
                    "title": "Draft product page",
                    "isCompleted": false
                  },
                  {
                    "title": "Notify customers",
                    "isCompleted": false
                  },
                  {
                    "title": "Notify network",
                    "isCompleted": false
                  },
                  {
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
                "subtasks": [
                  {
                    "title": "Draft out HN post",
                    "isCompleted": false
                  },
                  {
                    "title": "Get feedback and refine",
                    "isCompleted": false
                  },
                  {
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
                "subtasks": [
                  {
                    "title": "Write article",
                    "isCompleted": false
                  },
                  {
                    "title": "Publish on LinkedIn",
                    "isCompleted": false
                  },
                  {
                    "title": "Publish on Inndie Hackers",
                    "isCompleted": false
                  },
                  {
                    "title": "Publish on Medium",
                    "isCompleted": false
                  }
                ]
              }
            ]
          },
          {
            "name": "Doing",
            "color": "#d5e723",
            "tasks": []
          },
          {
            "name": "Done",
            "color": "#2367e7",
            "tasks": []
          }
        ]
      },
      {
        "id": 3,
        "name": "Roadmap",
        "columns": [
          {
            "name": "Now",
            "color": "#e72382",
            "tasks": [
              {
                "id": 4,
                "title": "Launch version one",
                "description": "We're planning to launch version one of our product in 2 weeks. We need to get everything ready for the launch, including the product page, assets, and network notifications.",
                "status": "Now",
                "subtasks": [
                  {
                    "title": "Launch privately to our waitlist",
                    "isCompleted": false
                  },
                  {
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
                "subtasks": [
                  {
                    "title": "Interview 10 customers",
                    "isCompleted": true
                  },
                  {
                    "title": "Review common customer pain points and suggestions",
                    "isCompleted": false
                  },
                  {
                    "title": "Outline next steps for our roadmap",
                    "isCompleted": false
                  }
                ]
              }
            ]
          },
          {
            "name": "Next",
            "color": "#23e7e1",
            "tasks": []
          },
          {
            "name": "Later",
            "color": "#23e729",
            "tasks": []
          }
        ]
      }
    ]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get board columns', () => {
    const columns = service.getBoardColumns(2);
    expect(columns.length).toBe(3);
  });

  it('should get board by id', () => {
    const board = service.getBoard(1);
    expect(board.name).toBe('Platform Launch');
  });

  it('should get board name by id', () => {
    const name = service.getBoardName(2);
    expect(name).toBe('Marketing Plan');
  });

  it('should check if board exists', () => {
    const exists = service.boardExists(2);
    expect(exists).toBeTrue();
  });

  it('should save a new board', async () => {
    const columns: Column[] = [{ name: 'New Column', color: '#ffffff', tasks: [] }];
    const promise = lastValueFrom(service.saveBoard(null, 'New Board', columns));
    await awaitPromise(promise);

    const newBoard = service.getBoard(4);
    expect(newBoard.name).toBe('New Board');
  });

  it('should update an existing board', async () => {
    const columns: Column[] = [{ name: 'Updated Column', color: '#ffffff', tasks: [] }];
    const promise = lastValueFrom(service.saveBoard(2, 'Updated Board', columns));
    await awaitPromise(promise);

    const updatedBoard = service.getBoard(2);
    expect(updatedBoard.name).toBe('Updated Board');
  });

  it('should set active board id', () => {
    service.setActiveBoardId(2);
    expect(service.activeBoardId()).toBe(2);
  });

  it('should save a new task', async () => {
    service.setActiveBoardId(2);
    const subtasks: Subtask[] = [{ title: 'New Subtask', isCompleted: false }];

    const promise = lastValueFrom(service.saveTask('Todo', 0, subtasks, 'Todo', 'New Task', 'New Task Description'));
    await awaitPromise(promise);

    const board = service.getBoard(2);
    const task = board.columns.find(c => c.name === 'Todo')?.tasks.find(t => t.title === 'New Task');

    expect(task).toBeTruthy();
  });

  it('should delete the active board', async () => {
    service.setActiveBoardId(2);
    const promise = lastValueFrom(service.deleteActiveBoard());
    await awaitPromise(promise);

    expect(service.boardExists(2)).toBeFalse();
  });

  it('should delete a task', async () => {
    service.setActiveBoardId(2);    
    const promise = lastValueFrom(service.deleteTask('Todo', 1));
    await awaitPromise(promise);

    const board = service.getBoard(2);

    const task = board.columns.find(c => c.name === 'Todo')?.tasks.find(t => t.id === 1);
    expect(task).toBeUndefined();
  });
});