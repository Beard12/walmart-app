import { WalmartAppPage } from './app.po';

describe('walmart-app App', () => {
  let page: WalmartAppPage;

  beforeEach(() => {
    page = new WalmartAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
