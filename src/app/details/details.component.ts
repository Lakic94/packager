import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectronService } from '../core/services';

@Component({
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  inputOptions: any[] = [];
  menuConfig;
  projectName;

  optionsForm: FormGroup;
  menuConfigForm: FormGroup;

  constructor(
    private electronService: ElectronService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.electronService.ipcRenderer.on('projectConfigs', (err, args) => {
      console.log(args);
      if (args) {
        this.inputOptions = args.options;
        this.menuConfig = args.menuConfig;
        this.createOptionsForm();
        this.createMenuForm();

      }
    });

    this.electronService.ipcRenderer.on('fileInt', (err, args) => {
      console.log(args);
    });

    this.route.params.subscribe(param => {
      console.log(param);
      this.projectName = param.name;
      this.electronService.ipcRenderer.send('initProjectConfigs', { name: param.name });
    });

  }

  get options() {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    return this.optionsForm.controls['options'] as FormArray;
  }

  get menuOptions() {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    return this.menuConfigForm.controls['options'] as FormArray;
  }

  getSubOptions(form) {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    // console.log(form);
    const productFormGroupArray = form.get('options').controls;
    // if (productFormGroupArray && productFormGroupArray.length > 0) {
    //   console.log('productFormGroup', productFormGroupArray[0].value.product);
    // }
    return productFormGroupArray;
  }

  ngOnInit(): void {
  }

  navigate() {
    this.router.navigate(['home']);
  }

  createOptionsForm() {
    this.optionsForm = new FormGroup({});

    const array = new FormArray([]);


    this.inputOptions.map(objectOption => {
      console.log(objectOption);


      const group = new FormGroup({});
      group.addControl(
        'name',
        this.fb.control(objectOption.name)
      );

      group.addControl(
        'title',
        this.fb.control(objectOption.title)
      );
      const objectArray = this.fb.array([]);

      objectOption.options.map(optionOptions => {

        const optionGroup = new FormGroup({});
        optionGroup.addControl(
          'name',
          this.fb.control(optionOptions.name)
        );

        optionGroup.addControl(
          'subtitle',
          this.fb.control(optionOptions.subtitle)
        );

        optionGroup.addControl(
          'title',
          this.fb.control(optionOptions.title)
        );

        optionGroup.addControl(
          'imageSrc',
          this.fb.control({ name: null, path: null })
        );
        objectArray.push(optionGroup);
      });

      group.addControl(
        'options',
        objectArray
      );

      array.push(group);

    });
    this.optionsForm.addControl('options', array);
    console.log(this.optionsForm, this.optionsForm.value);
    this.optionsForm.valueChanges.subscribe(res => {
      console.log(res);
    });
  }

  createMenuForm() {
    this.menuConfigForm = new FormGroup({});
    console.log(this.menuConfigForm);
    const array = new FormArray([]);
    this.menuConfig.map(config => {
      const group = this.fb.group({});
      group.addControl('name', this.fb.control(config.name));
      group.addControl('title', this.fb.control(config.title));
      group.addControl('imgSrc', this.fb.control({ name: null, path: null }));
      array.push(group);
    });

    this.menuConfigForm.addControl('options', array);
    this.menuConfigForm.valueChanges.subscribe(val => {
      console.log(val);
    });
  }

  saveChanges() {
    this.electronService.ipcRenderer.send(
      'saveChanges',
      {
        name: this.projectName,
        optionsConfig: this.optionsForm.value
      }
    );
  }

  savemenu() {
    this.electronService.ipcRenderer.send(
      'saveMenu',
      {
        name: this.projectName,
        menuConfig: this.menuConfigForm.value
      }
    );
  }

}
