/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FaktureComponent } from './fakture.component';

describe('FaktureComponent', () => {
  let component: FaktureComponent;
  let fixture: ComponentFixture<FaktureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaktureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaktureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
