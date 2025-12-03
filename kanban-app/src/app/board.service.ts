import { inject, Injectable, signal } from '@angular/core';
import { Board, Column, Subtask } from './model/board.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  router = inject(Router);
  http = inject(HttpClient);

  boards = signal<Board[]>([]);
  allBoards = this.boards.asReadonly();

  activeBoardId = signal<number | null>(null);

  constructor() {
    const activeBoardId = window.localStorage.getItem('activeBoardId');
    if (activeBoardId) {
      this.setActiveBoardId(parseInt(activeBoardId));
    }
  }

  //#region Board Management (local)
  /**
     * Obtains the stored columns/status for the specified board.
     * @param id - The ID of the board to retrieve the columns.
    */
  getBoardColumns(id: number | null) {
    const board = this.boards().filter(a => a.id == id);
    if (board.length == 0) {
      return [];
    }

    return [...board[0].columns];
  }

  /**
   * Allows to obtain the complete board based on the provided ID
   * @param id - The ID of the board to retrieve.
   */
  getBoard(id: number) {    
    return { ...this.boards().find(a => a.id == id)! };
  }

  /**
   * Retrieves the requested board's name.
   * @param id - The ID of the board to retrieve the name.
   */
  getBoardName(id: number | null) {
    return this.boards().find(a => a.id == id)?.name || '';
  }

  /**
   * Verifies if the specified board exists.
   * @param id - The ID of the board to verify.
  */
  boardExists(id: number) {
    return this.boards().some(a => a.id == id);
  }

  /**
   * Stores/Updates the current selected board ID.
   * @param id - The ID of the board currently selected (route).
  */
  setActiveBoardId(id: number) {
    this.activeBoardId.set(null);
    this.activeBoardId.set(id);
    window.localStorage.setItem('activeBoardId', id.toString());
  }

  /**
   * Generates a random hexadecimal color string.
   *
   * This function creates a random color by generating random values for the red, green,
   * and blue components of the color, converting these values to hexadecimal, and then
   * concatenating them into a single string prefixed with '#'.
   *
   * @returns {string} A random hexadecimal color string in the format '#RRGGBB'.
   */
  private getRandomHexColor(): string {
    const getRandomValue = () => Math.floor(Math.random() * 256);
    const toHex = (value: number) => value.toString(16).padStart(2, '0');

    const red = getRandomValue();
    const green = getRandomValue();
    const blue = getRandomValue();

    return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
  }
  //#endregion

  setBoardFullData() {
    return this.http.get<Board[]>(`${environment.apiBaseUrl}/boards`).pipe(
      tap((response) => {        
        if (response) {
          const boards = response;
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
          this.boards.set(boards);
        } else {
          this.boards.set([]);
        }        
      })
    );
  }

  /**
   * Updates/Adds the specified board.
   * @param boardName - The name of the board to be managed.
   * @param columns - The columns data to be included in the board.
  */
  saveBoard(id: number | null, name: string, columns: Column[]) {   
    let board: Board;

    // If board does not exist, create a new one
    // If it exists, remove it and then update the name
    if (id != null) {
      const boardIndex = this.boards().findIndex(a => a.id == id);
      board = { ...this.boards()[boardIndex] };
      this.boards().splice(boardIndex, 1);
      board.name = name;
    } else {
      board = {
        id: null,
        name: name,
        columns: []
      };
    }

    // Update columns
    for (const column of columns) {
      const currentColumn = board.columns.find(a => a.name == column.name);

      column.color = currentColumn?.color || this.getRandomHexColor();
      column.tasks = currentColumn?.tasks || [];
    }
    board.columns = columns;

    return this.http.post(`${environment.apiBaseUrl}/boards/save`, board);
  }

  /**
   * Saves or updates a task within the specified column.
   * If the task exists, it updates the task's details.
   * If the task does not exist, it creates a new task.
   * If the task's status changes, it moves the task to the new column.
   * 
   * @param columnName - The name of the column where the task is currently located.
   * @param id - The ID of the task to be saved or updated.
   * @param subtasks - The list of subtasks associated with the task.
   * @param status - The status of the task, which corresponds to the column name.
   * @param title - The title of the task (optional).
   * @param description - The description of the task (optional).
   */
  saveTask(columnName: string, id: number, subtasks: Subtask[], status: string, title = '', description = '') {
    const boardIndex = this.boards().findIndex(a => a.id == this.activeBoardId());
    const board = { ...this.boards()[boardIndex] };
    this.boards().splice(boardIndex, 1);
    board.columns = [...board.columns];    

    const activeBoardColumn = board.columns.find(a => a.name == columnName);
    const taskIndex = activeBoardColumn?.tasks.findIndex(b => b.id == id)!;
    let task = activeBoardColumn?.tasks[taskIndex];

    if (task) {
      if (columnName == status) {
        task.title = title == '' ? task.title : title;
        task.description = description == '' ? task.description : description;
        task.status = status;
        task.columnId = activeBoardColumn!.id;
        task.subtasks = subtasks;
      } else {
        const targetColumn = board.columns.find(a => a.name == status)!;
        activeBoardColumn!.tasks.splice(taskIndex, 1);

        targetColumn.tasks.push({
          ...task,
          title: title == '' ? task.title : title,
          description: description == '' ? task.description : description,
          status: status,
          columnId: targetColumn.id,
          subtasks: subtasks
        });
        task = {
          ...task,
          title: title == '' ? task.title : title,
          description: description == '' ? task.description : description,
          status: status,
          columnId: targetColumn.id,
          subtasks: subtasks
        }
      }
    } else {
      const targetColumn = board.columns.find(a => a.name == status)!;
      task = {
        id: null,
        title,
        description,
        status,
        columnId: targetColumn.id,
        subtasks,
      };
      targetColumn.tasks.push(task);
    }

    return this.http.post(`${environment.apiBaseUrl}/tasks/save`, task);
  }

  /**
   * Deletes the currently active board.
   *
   * This function finds the index of the currently active board in the list of boards,
   * removes it from the list, and then sets the active board ID to null.
   */
  deleteActiveBoard() {    
    return this.http.delete(`${environment.apiBaseUrl}/boards/delete/${this.activeBoardId()}`);
  }

  /**
   * Deletes the specified task from the specified column.
   *
   * This function finds the index of the specified task in the specified column, removes
   * it from the column, and then updates the list of boards with the modified column.
   *
   * @param columnName - The name of the column from which to delete the task.
   * @param id - The ID of the task to delete.
   */
  deleteTask(columnName: string, id: number) {
    const boardIndex = this.boards().findIndex(a => a.id == this.activeBoardId());
    const board = { ...this.boards()[boardIndex] };
    this.boards().splice(boardIndex, 1);
    board.columns = [...board.columns];

    const activeBoardColumn = board.columns.find(a => a.name == columnName)!;
    const taskIndex = activeBoardColumn.tasks.findIndex(b => b.id == id)!;
    activeBoardColumn.tasks.splice(taskIndex, 1);

    return this.http.post(`${environment.apiBaseUrl}/boards/save`, board);
  }
}
