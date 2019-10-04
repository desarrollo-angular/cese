import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CeseComponent } from './cese.component';

describe('CeseComponent', () => {
  let component: CeseComponent;
  let fixture: ComponentFixture<CeseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CeseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CeseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
