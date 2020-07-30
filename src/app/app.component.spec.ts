import {AppComponent} from './app.component';
import {fireEvent, render} from '@testing-library/angular';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createMock} from '@testing-library/angular/jest-utils';
import {of} from 'rxjs';

describe('AppComponent', () => {
  test('is rendered', async () => {
    const component = await render(AppComponent, {
      componentProperties: {
        title: 'Chuck Norris',
        jokeText: 'Random Joke'
      },
      imports: [
        HttpClientModule,
      ]
    });

    expect(component.container).toMatchSnapshot();
  });

  test('refreshes joke on click', async () => {
    const expectedJoke = 'Chuck Norris uses canvas in IE.';
    const http = createMock(HttpClient);
    http.get = jest.fn().mockReturnValue(of({
      type: 'success',
      value: {id: 535, joke: expectedJoke, categories: ['nerdy']}
    }));
    const component = await render(AppComponent, {
      providers: [
        {provide: HttpClient, useValue: http},
      ]
    });

    const button = component.getByRole('button');
    fireEvent.click(button);

    expect(http.get).toHaveBeenCalledTimes(2);
    expect(http.get).toHaveBeenCalledWith('http://api.icndb.com/jokes/random');
    expect(component.fixture.componentInstance.jokeText).toBe(expectedJoke);
    expect(component.getByRole('status')).toHaveTextContent(expectedJoke);
  });

  test('refreshes joke on init', async () => {
    const http = createMock(HttpClient);
    http.get = jest.fn().mockReturnValue(of({value: {joke: 'joke'}}));
    await render(AppComponent, {
      providers: [
        {provide: HttpClient, useValue: http},
      ]
    });
    expect(http.get).toHaveBeenCalledTimes(1);
  });

  test('renders quotes from joke', async () => {
    const http = createMock(HttpClient);
    http.get = jest.fn().mockReturnValue(of({value: {joke: '&quot;&quot;&quot;'}}));
    const component = await render(AppComponent, {
      providers: [
        {provide: HttpClient, useValue: http},
      ]
    });
    expect(component.fixture.componentInstance.jokeText).toBe('"""');
  });
});
