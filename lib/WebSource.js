import Builder from './Builder';
import WebContext from './WebContext';
import WebPage from './WebPage';

const WebSource = Builder.of('delay,delayRandom,limit', ({ delay = 1000, delayRandom = 250, limit = 1000000 }) => ({
  open: (url) => {
    const webContext = WebContext
      .delay(delay)
      .delayRandom(delayRandom)
      .limit(limit)
      .build();
    return WebPage.webContext(webContext).build().open(url);
  },
}), ({ builder }) => Object.assign({}, builder, {
  open: url => builder.builder().open(url),
}));
export default WebSource;
