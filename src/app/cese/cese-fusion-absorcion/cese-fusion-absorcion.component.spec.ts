import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CeseFusionAbsorcionComponent } from './cese-fusion-absorcion.component';

describe('CeseFusionAbsorcionComponent', () => {
  let component: CeseFusionAbsorcionComponent;
  let fixture: ComponentFixture<CeseFusionAbsorcionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CeseFusionAbsorcionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CeseFusionAbsorcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
