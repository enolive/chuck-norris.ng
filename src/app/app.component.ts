import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

interface JokeResponse {
  value: {
    joke: string
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Chuck Norris';
  jokeText = 'Chuck Norris Joke';

  constructor(private httpClient: HttpClient) {
  }

  refreshJoke() {
    const replaceHtmlEntities = (text: string) => text.replace(/&quot;/g, '"');
    this.httpClient
        .get<JokeResponse>('http://api.icndb.com/jokes/random')
        .pipe(
          map(response => response.value.joke),
          map(replaceHtmlEntities))
        .subscribe(value => {
          this.jokeText = value;
        });
  }

  ngOnInit(): void {
    this.refreshJoke();
  }
}
