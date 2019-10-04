import { TestBed, inject } from '@angular/core/testing';

import { ValidacionesService } from './validaciones.service';

describe('ValidacionesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidacionesService]
    });
  });

  it('should be created', inject([ValidacionesService], (service: ValidacionesService) => {
    expect(service).toBeTruthy();
  }));
});
