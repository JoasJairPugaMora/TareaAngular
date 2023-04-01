import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ComputerService } from 'src/app/services/computer.service';
import { Computer } from 'src/app/model/computer.model';

@Component({
  selector: 'app-edit-computer',
  templateUrl: './edit-computer.component.html',
  styleUrls: ['./edit-computer.component.css']
})
export class EditComputerComponent {
  formComputer?: FormGroup;
  computerId: number = 0;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private computerSvc: ComputerService,
    private router: Router,
  ) {
    this.formComputer = this.fb.group({
      brand: ['', [Validators.required, Validators.minLength(3)]],
      model: ['', [Validators.required]],
    });

    this.route.params.subscribe({
      next: (params => {
        this.computerId = params['id'];
        this.loadData();
      })
    });


  }

  loadData() {
    if (this.computerId != 0) {
      this.computerSvc.getComputer(this.computerId).subscribe({
        next: (item) => {
          this.formComputer?.patchValue(item);
        },
        error: (err) => {
          alert('Lo sentimos, ocurrió un error');
        }
      });
    } else {
      alert('No se encontro el elemento seleccionado');
    }
  }

  updateComputer() {
    let data = this.formComputer?.value as Computer;
    console.log(data);
    this.computerSvc.updateComputer(data).subscribe({
      next: () => {
        this.router.navigate(['/computers']);
      },
      error: (err) => {
        alert('Lo sentimos, ocurrió un error');
      }
    });
  }


}
