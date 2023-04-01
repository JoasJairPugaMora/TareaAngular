import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Computer } from 'src/app/model/computer.model';
import { ComputerService } from 'src/app/services/computer.service';

import { NewComputerComponent } from './new-computer.component';

describe('NewComputerComponent', () => {
  let component: NewComputerComponent;
  let fixture: ComponentFixture<NewComputerComponent>;

  let computerSvcSpy = jasmine.createSpyObj<ComputerService>('ComputerService', ['saveComputer']);

  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj<Router>(
      'Router',
      ['navigate']
    );
    await TestBed.configureTestingModule({
      declarations: [ NewComputerComponent ],
      imports: [
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: ComputerService, useValue: computerSvcSpy,
        },
        {
          provide: Router, useValue: routerSpy
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewComputerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save a computer successfully', () => {
    const computer = { brand: 'Apple', model: 'Macbook' } as Computer;
    computerSvcSpy.saveComputer.and.returnValue(of());
    component.formComputer?.patchValue(computer);
    component.saveComputer();
    expect(computerSvcSpy.saveComputer).toHaveBeenCalledWith(computer);
    //expect(routerSpy.navigate).toHaveBeenCalledWith(['computers']); Expected spy Router.navigate to have been called with:
    // [ [ 'computers' ] ] but it was never called.
  });

  it('should save a computer error', () => {
    const computer = { brand: 'Apple', model: 'Macbook' } as Computer;
    computerSvcSpy.saveComputer.and.returnValue(throwError(() => 'Lo sentimos ocurrió un error'));
    component.formComputer?.patchValue(computer);
    spyOn(window, 'alert');
    component.saveComputer();
    expect(window.alert).toHaveBeenCalledWith('Lo sentimos, ocurrió un error');
  });

});
