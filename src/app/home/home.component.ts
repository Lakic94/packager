import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ElectronService } from '../core/services';
import { PackageDialogComponent } from './package-dialog/package-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  projects = [];
  constructor(private electronService: ElectronService,
    private dialog: MatDialog, private zone: NgZone, private router: Router) {
    this.electronService.ipcRenderer.send('init');
    this.electronService.ipcRenderer.on('availableProjects', (event, args) => {
      console.log(args);
      this.zone.run(() => {
        this.projects = args;
      });
    });
    this.electronService.ipcRenderer.on('test', (event, args) => {
      console.log(args);
    });
  }

  ngOnInit(): void {
  }

  openDialog() {
    this.dialog.open(PackageDialogComponent, { width: '30%' }).afterClosed().subscribe(res => {
    });
  }

  navigate(project) {
    this.router.navigate(['/details', project.name]);
  }

}
