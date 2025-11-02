import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from "./layout/header/header.component";
import { ShowSidebarComponent } from './layout/sidebar/show-sidebar/show-sidebar.component';
import { ScreenSizeService } from './screen-size.service';
import { BoardService } from './board.service';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, ShowSidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  screenSizeService = inject(ScreenSizeService);
  boardService = inject(BoardService);
  loaderService = inject(LoaderService);

  hideSidebar = false;
  isMobileMediumSize = signal(false);

  ngOnInit(): void {
    this.screenSizeService.resized$.subscribe(sizes => {
      this.isMobileMediumSize.set(sizes.width <= this.screenSizeService.mobileMediumSize);
    });

    this.loaderService.start();
    this.boardService.setBoardFullData().subscribe({
      next: () => {
        this.loaderService.stop();
      },
      error: () => {
        this.loaderService.stop();
      }
    });
  }

  onHideSidebar() {
    this.hideSidebar = true;
  }

  onShowSidebar() {
    this.hideSidebar = false;
  }
}
