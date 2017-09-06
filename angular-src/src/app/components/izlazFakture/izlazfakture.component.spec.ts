/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IzlazfaktureComponent } from './izlazfakture.component';

describe('IzlazfaktureComponent', () => {
  let component: IzlazfaktureComponent;
  let fixture: ComponentFixture<IzlazfaktureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IzlazfaktureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IzlazfaktureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
