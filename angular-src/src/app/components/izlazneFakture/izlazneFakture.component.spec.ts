/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IzlazneFaktureComponent } from './izlaznefakture.component';

describe('IzlazfaktureComponent', () => {
  let component: IzlazneFaktureComponent;
  let fixture: ComponentFixture<IzlazneFaktureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IzlazneFaktureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IzlazneFaktureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
