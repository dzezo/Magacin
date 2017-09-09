/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UlazneFaktureComponent } from './ulazneFakture.component';

describe('FaktureComponent', () => {
  let component: UlazneFaktureComponent;
  let fixture: ComponentFixture<UlazneFaktureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UlazneFaktureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UlazneFaktureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
