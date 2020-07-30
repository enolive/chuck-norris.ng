import '@testing-library/jest-dom';
import 'jest-preset-angular';
import './jest-global-mocks';
import {configure} from '@testing-library/dom';

configure({
  defaultHidden: true
});
