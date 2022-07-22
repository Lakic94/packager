import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PickerDialogComponent } from './picker-dialog/picker-dialog.component';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImagePickerComponent),
      multi: true
    }
  ]
})
export class ImagePickerComponent implements OnInit, ControlValueAccessor {
  value: { name?: string; path?: string } = {};
  indexes: { i?: any; j?: any } = {};
  visible = false;
  inputControl: FormControl;

  constructor(public dialog: MatDialog) {
    this.inputControl = new FormControl('');
    this.inputControl.disable({ onlySelf: true });
  }

  @Input() set data(data: { i?: any; j?: any }) {
    // console.log(data);
    this.indexes = data;
  }

  onChange = (value: any | null): any | null => value;
  onTouched = () => { };

  writeValue(obj: any): void {
    console.log(obj);
    this.value = obj;
    // throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
    // throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
    // throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    // throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }

  openDialog() {
    this.dialog.open(PickerDialogComponent).afterClosed().subscribe((val => {
      console.log(val);
      this.visible = true;
      this.inputControl.setValue(this.value.name);
      const path = val.filePaths[0].length > 1 ? val.filePaths[0] : null;
      console.log(1);
      let imageName = `${this.indexes.i}`;
      if (this.indexes.j) {
        imageName += `-${this.indexes.j}`;
      }
      this.onChange({ name: imageName, path });
    }));
  }

}
