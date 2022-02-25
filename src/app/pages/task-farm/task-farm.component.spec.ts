import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFarmComponent } from './task-farm.component';

describe('TaskFarmComponent', () => {
  let component: TaskFarmComponent;
  let fixture: ComponentFixture<TaskFarmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskFarmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskFarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
