import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ElectronService } from '../../core/services';

@Component({
  selector: 'app-package-dialog',
  templateUrl: './package-dialog.component.html',
  styleUrls: ['./package-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackageDialogComponent implements OnInit {
  value = new FormControl('', Validators.required);
  test = 'test';
  constructor(private dialogRef: MatDialogRef<PackageDialogComponent>,
    private electronService: ElectronService,
    private readonly cdRef: ChangeDetectorRef,
    private zone: NgZone) {
    this.electronService.ipcRenderer.on('closeDialog', (event, args) => {
      // console.log(args.close, event);
      this.test = '';
      this.zone.run(() => {
        this.dialogRef.close();

      });
      // this.cdRef.detectChanges();
    });
  }

  ngOnInit(): void {
  }

  openFilePicker() {
    this.electronService.ipcRenderer.send('select-dirs', { name: this.value.value });
  }
}
