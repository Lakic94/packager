import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ElectronService } from '../core/services';

@Component({
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  options: any[] = [];
  menuConfig;

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
        this.options = args.options;
        this.menuConfig = args.menuConfig;
        this.createForm();
      }

    });
    this.route.params.subscribe(param => {
      console.log(param);
      this.electronService.ipcRenderer.send('initProjectConfigs', { name: param.name });
    });



  }

  ngOnInit(): void {
  }

  navigate() {
    this.router.navigate(['home']);
  }

  createForm() {
    // this.optionsForm = new FormGroup({ options: this.fb.array([]) });

    this.options.map(option => {
      this.fb.group({
        name: option.name,
        title: option.title
      });
    });

  }


}
