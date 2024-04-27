import CacheService from './cache.service';
import { JSDOM } from 'jsdom';

export default class NovelService {
  private static instance: NovelService;

  private constructor(private readonly cacheService: CacheService) {}

  public static async createInstance(): Promise<NovelService> {
    const cacheService = await CacheService.createInstance();
    const instance = new NovelService(cacheService);

    return instance;
  }

  public static async getInstance(): Promise<NovelService> {
    if (!NovelService.instance) {
      NovelService.instance = await NovelService.createInstance();
    }

    return NovelService.instance;
  }

  public async getData(url: string, selector: string): Promise<string[]> {
    const cachedData = await this.cacheService.get<string[]>(
      `novel:${JSON.stringify({ url, selector })}`,
    );

    if (cachedData) return cachedData;

    const response = await fetch(url, {
      method: 'GET',
    });
    const document = await response.text();
    const jsDom = new JSDOM(document);
    const contentContainer = jsDom.window.document.querySelector(selector);
    const lines = Array.from(contentContainer?.children ?? []).map((child) => {
      const blacklist = ['SCRIPT', 'DIV'];
      if (blacklist.includes(child.tagName)) return '';
      return child.textContent ?? '';
    });
    const content = lines.filter((line) => line?.trim()?.length > 0);

    await this.cacheService.set(
      `novel:${JSON.stringify({ url, selector })}`,
      content,
      300,
    );

    return content;
  }
}
