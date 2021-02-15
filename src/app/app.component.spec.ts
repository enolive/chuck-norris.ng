import {AppComponent} from './app.component';
import {fireEvent, render, RenderResult} from '@testing-library/angular';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createMock, Mock} from '@testing-library/angular/jest-utils';
import {of} from 'rxjs';

describe('AppComponent', () => {
  let httpMock: Mock<HttpClient>;

  const renderWithMock = async (): Promise<RenderResult<AppComponent, AppComponent>> =>
    await render(AppComponent, {
      providers: [
        {provide: HttpClient, useValue: httpMock},
      ]
    });

  beforeEach(() => {
    httpMock = createMock(HttpClient);
  });

  test('is rendered', async () => {
    const {container} = await render(AppComponent, {
      componentProperties: {
        title: 'Chuck Norris',
        jokeText: 'Random Joke'
      },
      imports: [
        HttpClientModule,
      ]
    });

    expect(container).toMatchSnapshot();
  });

  test('refreshes joke on click', async () => {
    const expectedJoke = 'Chuck Norris uses canvas in IE.';
    httpMock.get = jest.fn().mockReturnValue(of({
      type: 'success',
      value: {id: 535, joke: expectedJoke, categories: ['nerdy']}
    }));
    const {fixture, getByRole} = await renderWithMock();
    const button = getByRole('button');

    fireEvent.click(button);

    expect(httpMock.get).toHaveBeenCalledTimes(2);
    expect(httpMock.get).toHaveBeenCalledWith('http://api.icndb.com/jokes/random');
    expect(fixture.componentInstance.jokeText).toBe(expectedJoke);
    expect(getByRole('status')).toHaveTextContent(expectedJoke);
  });

  test('refreshes joke on init', async () => {
    httpMock.get = jest.fn().mockReturnValue(of({value: {joke: 'joke'}}));

    await renderWithMock();

    expect(httpMock.get).toHaveBeenCalledTimes(1);
  });

  test('renders quotes from joke', async () => {
    httpMock.get = jest.fn().mockReturnValue(of({value: {joke: '&quot;&quot;&quot;'}}));

    const {fixture} = await renderWithMock();

    expect(fixture.componentInstance.jokeText).toBe('"""');
  });
});
