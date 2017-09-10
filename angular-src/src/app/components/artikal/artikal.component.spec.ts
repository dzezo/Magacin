/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ArtikalComponent } from './artikal.component';

describe('ArtikalComponent', () => {
  let component: ArtikalComponent;
  let fixture: ComponentFixture<ArtikalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtikalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtikalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
