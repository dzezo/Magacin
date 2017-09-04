/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IzlazComponent } from './izlaz.component';

describe('IzlazComponent', () => {
  let component: IzlazComponent;
  let fixture: ComponentFixture<IzlazComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IzlazComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IzlazComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
