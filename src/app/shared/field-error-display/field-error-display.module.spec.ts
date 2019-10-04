import { FieldErrorDisplayModule } from './field-error-display.module';

describe('FieldErrorDisplayModule', () => {
  let fieldErrorDisplayModule: FieldErrorDisplayModule;

  beforeEach(() => {
    fieldErrorDisplayModule = new FieldErrorDisplayModule();
  });

  it('should create an instance', () => {
    expect(fieldErrorDisplayModule).toBeTruthy();
  });
});
