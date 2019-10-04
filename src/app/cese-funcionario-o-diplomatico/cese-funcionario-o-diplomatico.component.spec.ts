import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CeseFuncionarioODiplomaticoComponent } from './cese-funcionario-o-diplomatico.component';

describe('CeseFuncionarioODiplomaticoComponent', () => {
  let component: CeseFuncionarioODiplomaticoComponent;
  let fixture: ComponentFixture<CeseFuncionarioODiplomaticoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CeseFuncionarioODiplomaticoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CeseFuncionarioODiplomaticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
