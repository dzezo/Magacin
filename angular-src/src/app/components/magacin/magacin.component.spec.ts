/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MagacinComponent } from './magacin.component';

describe('MagacinComponent', () => {
  let component: MagacinComponent;
  let fixture: ComponentFixture<MagacinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagacinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagacinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
