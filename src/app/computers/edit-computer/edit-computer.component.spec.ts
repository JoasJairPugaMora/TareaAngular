import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { groupBy, NEVER, Observable, of, throwError } from 'rxjs';
import { Computer } from 'src/app/model/computer.model';
import { ComputerService } from 'src/app/services/computer.service';

import { EditComputerComponent } from './edit-computer.component';

describe('EditComputerComponent', () => {
  let component: EditComputerComponent;
  let fixture: ComponentFixture<EditComputerComponent>;
  let service: ComputerService;

  let computerSvcSpy = jasmine.createSpyObj<ComputerService>(
    'ComputerService', ['saveComputer', 'getComputer', 'updateComputer',]
  );

  let activatedRouteSpy = jasmine.createSpyObj<ActivatedRoute>(
    'ActivatedRoute', ['params']
  );

  activatedRouteSpy.params = NEVER;

  activatedRouteSpy.params = of({ id: 2 });

  let routerSvcSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditComputerComponent ],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'computers',
            redirectTo: ''
          },
        ]),
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers:[
        {
          provide: ComputerService, useValue: computerSvcSpy,
        },
        {
          provide: ActivatedRoute, useValue: activatedRouteSpy,
        }
      ]
    })
    .compileComponents();

    service = TestBed.inject(ComputerService);

    fixture = TestBed.createComponent(EditComputerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should loadData ok', () => {
    const computer = { brand: 'Apple', model: 'Macbook' } as Computer;
    computerSvcSpy.getComputer.and.returnValue(of(computer));
    component.formComputer?.patchValue(computer);
    component.loadData();
    expect(component.formComputer?.value).toEqual(computer);
  });

  it('should loadData error', () => {
    const computer = { brand: 'Apple', model: 'Macbook' } as Computer;
    computerSvcSpy.getComputer.and.returnValue(
      throwError(() => 'Lo sentimos ocurrió un error')
      );
    spyOn(window, 'alert');
    component.loadData();
    expect(window.alert).toHaveBeenCalledWith('Lo sentimos, ocurrió un error');
  });

  it('should loadData - not found', () => {
    const computer = { brand: 'Apple', model: 'Macbook' } as Computer;
    spyOn(window, 'alert');
    component.computerId = 0;
    component.loadData();
    expect(window.alert).toHaveBeenCalledWith('No se encontro el elemento seleccionado');
  });


  // it('should update a computer ok', () => {
  //   const computer = { brand: 'Apple', model: 'Macbook' } as Computer;
  //   computerSvcSpy.updateComputer.and.returnValue(of(computer));
  //   component.formComputer?.setValue({brand: 'Apple', model: 'M'});
  //   component.updateComputer();
  //   expect(routerSvcSpy.navigate).toHaveBeenCalledWith(['/computers']);
  // });

  it('should update a computer error', () => {
    const computer = { brand: 'Apple', model: 'Macbook' } as Computer;
    computerSvcSpy.updateComputer.and.returnValue(throwError(() => 'Lo sentimos ocurrió un error'));
    component.formComputer?.patchValue(computer);
    spyOn(window, 'alert');
    component.updateComputer();
    expect(window.alert).toHaveBeenCalledWith('Lo sentimos, ocurrió un error');
  });

});
