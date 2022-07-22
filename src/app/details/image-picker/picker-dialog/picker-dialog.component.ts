import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ElectronService } from '../../../core/services';

@Component({
  selector: 'app-picker-dialog',
  templateUrl: './picker-dialog.component.html',
  styleUrls: ['./picker-dialog.component.scss']
})
export class PickerDialogComponent implements OnInit {

  constructor(
    public ref: MatDialogRef<PickerDialogComponent>,
    private electronService: ElectronService,
    private zone: NgZone
  ) {
    this.electronService.ipcRenderer.send('select-image');
    this.electronService.ipcRenderer.on('select-image-close', (event, args) => {
      console.log(args.files, event);
      this.zone.run(() => {
        this.ref.close(args.files);
      });
    });
  }

  ngOnInit(): void {

  }

  closeDialog() {
    this.ref.close();
  }

}
