import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Computer } from '../model/computer.model';
import { ComputerService } from '../services/computer.service';

import { ComputersComponent } from './computers.component';

describe('ComputersComponent', () => {
  let component: ComputersComponent;
  let fixture: ComponentFixture<ComputersComponent>;

  let computerSvcSpy = jasmine.createSpyObj<ComputerService>(
    'ComputerService', ['getComputers', 'deleteComputer']
  );

  computerSvcSpy.getComputers.and.returnValue(of([]));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComputersComponent ],
      imports: [
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: ComputerService, useValue: computerSvcSpy
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComputersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should loadData ok', (() => {
    const computers: Computer[] = [
      { id: 1, brand: 'Lenovo', model: 'ThinkPad' },
      { id: 2, brand: 'Dell', model: 'Latitude' }
    ];

    computerSvcSpy.getComputers.and.returnValue(of(computers));
    component.loadData();

    expect(component.computers.data).toEqual(computers);
  }));

  it('should loadData error', (() => {
    computerSvcSpy.getComputers.and.returnValue(throwError(() => 'Lo sentimos ocurrió un error'));
    spyOn(window, 'alert');
    component.loadData();

    expect(window.alert).toHaveBeenCalledWith('Lo sentimos ocurrió un error');
  }));

  it('should delete computer ok', (() => {
    const computers: Computer[] = [
      { id: 1, brand: 'Lenovo', model: 'ThinkPad' },
      { id: 2, brand: 'Dell', model: 'Latitude' }
    ];
    computerSvcSpy.getComputers.and.returnValue(of(computers));
    computerSvcSpy.deleteComputer.and.returnValue(of(([])));

    const computerToDelete = computers[0];
    spyOn(window, 'alert');
    component.deleteComputer(computerToDelete);

    expect(computerSvcSpy.deleteComputer).toHaveBeenCalledWith(computerToDelete.id);
  }));

  it('should show an alert on delete error', (() => {
    const computers: Computer[] = [
      { id: 1, brand: 'Lenovo', model: 'ThinkPad' },
      { id: 2, brand: 'Dell', model: 'Latitude' }
    ];
    computerSvcSpy.getComputers.and.returnValue(of(computers));
    computerSvcSpy.deleteComputer.and.returnValue(throwError(() => 'Lo sentimos ocurrió un error'));

    const computerToDelete = computers[0];
    spyOn(window, 'alert');
    component.deleteComputer(computers[1]);

    expect(window.alert).toHaveBeenCalledWith('Lo sentimos, ocurrió un error');
  }));


});
