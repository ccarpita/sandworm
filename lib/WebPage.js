import Rx from 'rxjs/Rx';
import fetch from 'isomorphic-fetch';

import Builder from './Builder';

import { unimplemented } from './util';

const WebPage = Builder.of('html,webContext', ({ html, webContext }) => ({
  open: url => Rx.Observable.create((observer) => {
    fetch(url)
      .then(res => res.text())
      .then(resText => WebPage.html(resText).webContext(webContext).build())
      .then((page) => {
        observer.next(page);
        observer.complete();
      });
  }),
  follow: unimplemented('WebPage.follow'),
  find: unimplemented('WebPage.find'),
  html: () => html,
}));
export default WebPage;
