/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UlazComponent } from './ulaz.component';

describe('UlazComponent', () => {
  let component: UlazComponent;
  let fixture: ComponentFixture<UlazComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UlazComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UlazComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
